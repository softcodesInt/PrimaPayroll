/* eslint-disable no-shadow */
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Table } from 'react-bootstrap';
import styled from 'styled-components';
import moment from 'moment';
import { debounce, isEmpty } from 'codewonders-helpers';
import { useMount } from 'broad-state';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import NavLayout from 'components/layout/dashboard-layout/navbar';
import Input from 'components/input';
import { DashboardSubWrapper } from 'pages/dashboard/company-structure';
import {
	getAllEmployees,
	downloadAllPayslip,
	sendEssInvitation,
} from 'redux/employee/actions';
import { selectAllEmployees, selectisLoading } from 'redux/employee/selectors';
import { selectAuthUser } from 'redux/user/selectors';
import {
	getAllTerminateReason,
	getAllReinstateReason,
} from 'redux/settings/actions';
import {
	selectAllTerminateReasons,
	selectAllReinstateReasons,
} from 'redux/settings/selectors';
import Loader from 'components/loader';
import Paginate from 'components/pagination';
import { getTrueKeys } from 'utils';
import history from 'utils/history';
import Search from 'assets/icons/icon-search.svg';
import { ReactComponent as More } from 'assets/icons/icon-menu-vertical.svg';
import { TableWrap, TableHead } from 'components/layout/dashboard-layout';
import { ReinstateTerminate } from './reinstate-terminate';

const propTypes = {
	noNav: PropTypes.bool,
	getAllEmployees: PropTypes.func,
	isLoading: PropTypes.bool,
	employees: PropTypes.array,
	getAllReinstateReason: PropTypes.func,
	getAllTerminateReason: PropTypes.func,
	terminateReasons: PropTypes.array,
	reinstateReason: PropTypes.array,
	authUser: PropTypes.shape,
	sendEssInvitation: PropTypes.func,
};

const EmployeeList = ({
	noNav = false,
	getAllEmployees,
	isLoading,
	employees,
	getAllReinstateReason,
	getAllTerminateReason,
	terminateReasons,
	reinstateReason,
	sendEssInvitation,
	authUser,
}) => {
	const [searchStructure, setStructure] = useState('');
	const previousStructureRef = useRef('');

	useMount(() => {
		getAllEmployees();
		getAllReinstateReason();
		getAllTerminateReason();
	});

	const searchStructures = debounce(async (value) => {
		if (previousStructureRef.current === value) {
			try {
				// await refetch();
			} finally {
				await getAllEmployees(value);
			}
		}
	}, 500);

	const [modalState, setModalState] = useState({
		displayModal: false,
		title: '',
		userId: '',
	});

	const handleReinstateTerminate = (userId, displayTitle) => {
		setModalState((state) => ({
			...state,
			userId,
			displayTitle,
			displayModal: true,
		}));
	};

	const handleCloseModal = () => {
		setModalState((state) => ({
			...state,
			displayModal: !modalState.displayModal,
		}));
	};

	const getOpposite = (state) =>
		state === 'TERMINATED' ? 'reinstate' : 'terminate';

	const goToDetailPage = (employeeId) => {
		window.location = `/dashboard/employee/detail/${employeeId}`;
	};

	return (
		<>
			{!noNav && <NavLayout title="Employees" isBack />}
			<DashboardSubWrapper className="wrapper-contain">
				<h4 className="page-main-title">Employees</h4>
				<div className="row">
					<div className="col-md-3">
						<div className="card main-table-wrapper">
							<div className="card-body">
								<p className="summary-title">Active Employees</p>
								<h3 className="card-summary-value">
									{employees?.active_employees || '...'}
								</h3>
							</div>
						</div>
					</div>
					<div className="col-md-3">
						<div className="card main-table-wrapper">
							<div className="card-body">
								<p className="summary-title">Terminated Employees</p>
								<h3 className="card-summary-value">
									{employees?.terminated_employees}
								</h3>
							</div>
						</div>
					</div>
					<div className="col-md-3">
						<div className="card main-table-wrapper">
							<div className="card-body">
								<p className="summary-title">Employees on Leave</p>
								<h3 className="card-summary-value">
									{employees?.terminated_employees}
								</h3>
							</div>
						</div>
					</div>
				</div>
				<EmployeeTableWrapper className="main-table-wrapper mt-5">
					<TableWrap>
						<TableHead className="">
							<Input
								placeholder="search..."
								label=""
								background="#E4E6EB"
								icon={Search}
								value={searchStructure}
								onChange={(e) => {
									setStructure(e.target.value);
									previousStructureRef.current = e.target.value;
									searchStructures(e.target.value);
								}}
								inputClassName="table-search-input"
							/>
							<button
								type="button"
								className="btn btn-danger table-add-new"
								onClick={() =>
									history.push('/dashboard/employee/add?page=employee-info')
								}
							>
								+ Add Employee
							</button>
						</TableHead>

						{!isLoading ? (
							<Table responsive>
								{!isLoading && !isEmpty(employees?.results) ? (
									<>
										<thead>
											<tr>
												<th>Employee Code</th>
												<th>Name</th>
												<th>Date Engaged</th>
												<th>Workdays</th>
												<th>Job Title</th>
												<th>Status</th>
												<th className="text-right">Actions</th>
											</tr>
										</thead>
										<tbody>
											{employees?.results?.map((employee) => (
												<tr>
													<td>{employee?.employee_code || 'N/A'}</td>
													<td>{`${employee?.first_name} ${employee?.last_name}`}</td>
													<td>
														{employee?.date_engaged
															? moment(employee.date_engaged).format(
																	'YYYY-MM-DD'
															  )
															: 'NO DATE ENGAGED'}
													</td>
													<td>
														{getTrueKeys({
															M: employee?.works_monday,
															T: employee?.works_tuesday,
															W: employee?.works_wednesday,
															Thr: employee?.works_thursday,
															F: employee?.works_friday,
															Sat: employee?.works_saturday,
															Sun: employee?.works_sunday,
														}).toString()}
													</td>
													<td>{employee?.job_title?.name || 'N/A'}</td>
													<td>
														<span
															className={`status-${
																!employee.is_active ||
																employee?.status === 'TERMINATED'
																	? 'inactive'
																	: 'active'
															}`}
														>
															{employee?.status}
														</span>
													</td>
													<td className="text-right">
														<Dropdown>
															<Dropdown.Toggle as={More} />
															<Dropdown.Menu>
																<Dropdown.Item
																	href="#!"
																	onClick={() => goToDetailPage(employee?.id)}
																>
																	View
																</Dropdown.Item>
																<Dropdown.Item
																	href="#!"
																	onClick={() =>
																		history.push(
																			`/dashboard/employee/edit/${employee.id}?page=employee-info`
																		)
																	}
																>
																	Edit
																</Dropdown.Item>
																{employee?.is_active && (
																	<Dropdown.Item
																		href="#!"
																		className="red text-capitalize"
																		onClick={() =>
																			handleReinstateTerminate(
																				employee?.id,
																				getOpposite(employee?.status)
																			)
																		}
																	>
																		{getOpposite(employee?.status)}
																	</Dropdown.Item>
																)}
																{authUser?.company?.bought_ess && (
																	<Dropdown.Item
																		href="#!"
																		onClick={() =>
																			sendEssInvitation(employee?.id)
																		}
																	>
																		Send Invite
																	</Dropdown.Item>
																)}
															</Dropdown.Menu>
														</Dropdown>
													</td>
												</tr>
											))}
										</tbody>
									</>
								) : (
									<p className="text-center m-auto no-data">No Employees Yet</p>
								)}
							</Table>
						) : (
							<Loader loadingText="Getting Employees..." />
						)}
						<Paginate
							total={employees?.total_pages}
							next={employees?.next}
							currentPage={employees?.current_page}
							previous={employees?.previous}
							getData={getAllEmployees}
							getNext={() => getAllEmployees('', '', employees?.next)}
							getPrevious={() => getAllEmployees('', '', employees?.previous)}
						/>
					</TableWrap>
				</EmployeeTableWrapper>
				{modalState.displayModal ? (
					<ReinstateTerminate
						displayModal={modalState.displayModal}
						closeModal={handleCloseModal}
						displayTitle={modalState.displayTitle}
						userId={modalState.userId}
						choices={
							modalState.displayTitle === 'terminate'
								? terminateReasons
								: reinstateReason
						}
					/>
				) : (
					<></>
				)}
			</DashboardSubWrapper>
		</>
	);
};

EmployeeList.propTypes = propTypes;

const EmployeeTableWrapper = styled.div`
	margin-top: 0.3rem;
`;

const mapStateToProps = createStructuredSelector({
	isLoading: selectisLoading,
	employees: selectAllEmployees,
	terminateReasons: selectAllTerminateReasons,
	reinstateReason: selectAllReinstateReasons,
	authUser: selectAuthUser,
});
export default connect(mapStateToProps, {
	getAllEmployees,
	downloadAllPayslip,
	getAllTerminateReason,
	getAllReinstateReason,
	sendEssInvitation,
})(EmployeeList);
