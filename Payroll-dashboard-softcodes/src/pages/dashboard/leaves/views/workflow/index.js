/* eslint-disable react/button-has-type */
/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React, { useState, useRef } from 'react';
import styled from 'styled-components';
/* -------------------------- Internal Dependencies ------------------------- */
import NavLayout from 'components/layout/dashboard-layout/navbar';
import { useMount } from 'broad-state';
import { DashboardSubWrapper } from 'pages/dashboard/company-structure';
import { connect } from 'react-redux';
import { debounce, isEmpty } from 'codewonders-helpers';
import { createStructuredSelector } from 'reselect';
import AutoCompleteInput from 'components/autocomplete-input';
import { ReactComponent as Loading } from 'assets/icons/loading.svg';
import { TableWrap } from 'components/layout/dashboard-layout';
import Loader from 'components/loader';
import Select from 'components/select';
import { Link } from 'react-router-dom';
import Button from 'components/button';
import Input from 'components/input';
import { Formik } from 'formik';
import { Table } from 'react-bootstrap';
import { getAllEmployees } from 'redux/employee/actions';
import { selectAllEmployees, selectisLoading } from 'redux/employee/selectors';
import {
	selectisLoading as EmployeeAvailableLeavesLoading,
	selectEmployeeAvailableLeaves,
	selectEmployeeWorkflowLoading,
} from 'redux/leave/selectors';
import {
	getEmployeeAvailableLeave,
	saveLeaveWorkflow,
} from 'redux/leave/actions';
import EmployeeStructure from 'redux/employee/types';
import { leaveWorkflowSchema } from 'utils/validation-schema';

const LeaveWorkflow = ({
	getAllEmployees,
	isLoading,
	employees,
	dispatch,
	getEmployeeAvailableLeave,
	availableLeaves,
	employeeLeaveLoading,
	saveLeaveWorkflow,
	isSavingLoading,
}) => {
	useMount(() => {
		getAllEmployees();
	});

	const [searchTerm, setSearchTerm] = useState('');
	const [employeeId, setActiveEmployeeId] = useState('');
	const previousSearchTermRef = useRef('');

	const search = debounce(async (value) => {
		if (previousSearchTermRef.current === value) {
			try {
				// await refetch();
			} finally {
				await getAllEmployees(value);
			}
		}
	}, 500);

	const state = {};

	return (
		<>
			<NavLayout title="Leave Workflow" isBack />
			<DashboardSubWrapper className="wrapper-contain">
				<h4 className="page-main-title">Manage Leave Workflow</h4>
				<div className="main-table-wrapper mt-5">
					<SectionHeadsnItems>
						<p className="summary-title">
							Note that it&lsquo;s advisable to have setup all{' '}
							<Link to="/dashboard/settings/holiday-setup">Holidays</Link>{' '}
							before doing this. <br />
							Any <Link to="/dashboard/settings/holiday-setup">
								Holiday
							</Link>{' '}
							setup after a user goes on leave won&lsquo;t be accounted for
						</p>
						<div className="row">
							<div className="col-sm-12 offset-sm-1">
								<Formik
									initialValues={{
										employee: '',
										leave: '',
										number_of_days: '',
										start_date: '',
									}}
									onSubmit={(values) => saveLeaveWorkflow(employeeId, values)}
									validationSchema={leaveWorkflowSchema}
								>
									{({
										values,
										errors,
										touched,
										handleChange,
										setFieldValue,
										handleBlur,
										handleSubmit,
									}) => (
										<div className="row mt-5">
											<div className="col-sm-6">
												<AutoCompleteInput
													hasStrip
													id="employee"
													name="employee"
													type="text"
													label="Select Employee*"
													placeholder="Search and Select an employee"
													value={searchTerm || state.parent?.split(',')[0]}
													onChange={(e) => {
														setSearchTerm(e.target.value);
														previousSearchTermRef.current = e.target.value;
														search(e.target.value);
														setActiveEmployeeId(e.target.value);
													}}
													activeClassName={
														searchTerm &&
														searchTerm === values?.parent?.split(',')[0]
													}
													onBlur={handleBlur}
													errorMessage={errors.parent}
													isInvalid={errors.parent && touched.parent}
												>
													{' '}
													{!isLoading ? (
														<>
															{!isEmpty(employees?.results) ? (
																<>
																	{employees?.results?.map((employee) => (
																		<button
																			onClick={(e) => {
																				e.preventDefault();
																				getEmployeeAvailableLeave(employee?.id);
																				setSearchTerm(
																					`${employee?.first_name} ${employee?.last_name} - ${employee.employee_code}`
																				);
																				setFieldValue('employee', employee?.id);
																				setActiveEmployeeId(employee?.id);
																				dispatch({
																					type: EmployeeStructure.GET_EMPLOYEE,
																					payload: {
																						loading: false,
																						data: employee,
																					},
																				});
																			}}
																			className="button"
																		>
																			<p>{employee?.first_name}</p>
																		</button>
																	))}
																</>
															) : (
																<p className="mx-2 text-center">
																	No Employee found
																</p>
															)}
														</>
													) : (
														<Loading />
													)}
												</AutoCompleteInput>
											</div>
											<div className="row">
												<div className="col-sm-8">
													{employeeId &&
														!employeeLeaveLoading &&
														availableLeaves && (
															<>
																<p className="summary-title">
																	{searchTerm} Available leaves
																</p>
																<TableWrap>
																	{' '}
																	{!employeeLeaveLoading ? (
																		<Table responsive bordered>
																			{!isLoading &&
																			!isEmpty(
																				availableLeaves?.available_leaves
																			) ? (
																				<>
																					<thead>
																						<tr>
																							<th>S/N</th>
																							<th>Name</th>
																							<th>Days Available</th>
																						</tr>
																					</thead>
																					<tbody>
																						{availableLeaves?.available_leaves?.map(
																							(leave, index) => (
																								<tr>
																									<td>{index + 1}</td>
																									<td>{leave.name}</td>
																									<td>{leave.days_left}</td>
																								</tr>
																							)
																						)}
																					</tbody>
																				</>
																			) : (
																				<p className="text-center mx-auto mt-5 no-data">
																					No Available Leaves yet
																				</p>
																			)}
																		</Table>
																	) : (
																		<Loader loadingText="Getting Available Leaves" />
																	)}
																</TableWrap>{' '}
																<div className="row mt-4">
																	<div className="col-md-12">
																		<div className="row">
																			<div className="col-md-4">
																				<Select
																					hasStrip
																					id="leave"
																					name="leave"
																					label="Leave*"
																					value={values.leave}
																					onChange={handleChange}
																					onBlur={handleBlur}
																					errorMessage={errors.leave}
																					isInvalid={
																						errors.leave && touched.leave
																					}
																				>
																					<option>--Choose a leave--</option>
																					{availableLeaves?.available_leaves.map(
																						(leave) => (
																							<option
																								value={leave.id}
																								key={leave.id}
																							>
																								{leave.name}
																							</option>
																						)
																					)}
																				</Select>
																			</div>
																			<div className="col-md-4">
																				<Input
																					hasStrip
																					id="number_of_days"
																					name="number_of_days"
																					type="number"
																					label="Number of days*"
																					placeholder="How many days is the user going to be on leave?"
																					value={values.number_of_days}
																					onChange={handleChange}
																					onBlur={handleBlur}
																					errorMessage={errors.number_of_days}
																					isInvalid={
																						errors.number_of_days &&
																						touched.number_of_days
																					}
																				/>
																			</div>
																			<div className="col-md-4">
																				<Input
																					hasStrip
																					id="start_date"
																					name="start_date"
																					type="date"
																					format="yyyy-mm-dd"
																					label="Start Date of leave*"
																					placeholder="yyyy-mm-dd"
																					value={values.start_date}
																					onChange={handleChange}
																					onBlur={handleBlur}
																					errorMessage={errors.start_date}
																					isInvalid={
																						errors.start_date &&
																						touched.start_date
																					}
																				/>
																				<Button
																					type="submit"
																					className="btn-soft mt-4"
																					isLoading={isSavingLoading}
																					disabled={isSavingLoading}
																					onClick={handleSubmit}
																				>
																					Submit
																				</Button>
																			</div>
																		</div>
																	</div>
																</div>
															</>
														)}
												</div>
											</div>
										</div>
									)}
								</Formik>
							</div>
						</div>
					</SectionHeadsnItems>
				</div>
			</DashboardSubWrapper>
		</>
	);
};

const SectionHeadsnItems = styled.div`
	justify-content: center;
	padding: 2rem;
`;

const mapStateToProps = createStructuredSelector({
	isLoading: selectisLoading,
	employees: selectAllEmployees,
	availableLeaves: selectEmployeeAvailableLeaves,
	employeeLeaveLoading: EmployeeAvailableLeavesLoading,
	isSavingLoading: selectEmployeeWorkflowLoading,
});

const mapDispatchToProps = (dispatch) => {
	return {
		dispatch: (data) => dispatch(data),
		getAllEmployees: (data) => dispatch(getAllEmployees(data)),
		getEmployeeAvailableLeave: (id) => dispatch(getEmployeeAvailableLeave(id)),
		saveLeaveWorkflow: (employeeId, data) =>
			dispatch(saveLeaveWorkflow(employeeId, data)),
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(LeaveWorkflow);
