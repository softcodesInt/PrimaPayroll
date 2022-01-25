import React, { useState } from 'react';
import { Dropdown, Table } from 'react-bootstrap';
import NavLayout from 'components/layout/dashboard-layout/navbar';
import { ReactComponent as More } from 'assets/icons/icon-menu-vertical.svg';
import { ReactComponent as Add } from 'assets/icons/icon-add.svg';
import { TableWrap, TableHead } from 'components/layout/dashboard-layout';
import { useMount } from 'broad-state';
import { deactivateJobGrades, getAllJobGrades } from 'redux/settings/actions';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectAllJobGrades, selectisLoading } from 'redux/settings/selectors';
import { isEmpty, trunc } from 'codewonders-helpers';
import Loader from 'components/loader';
import { DashboardSubWrapper } from '../../company-structure';
import AddJobGrade from './add-job-grade';

const JobGrades = ({
	isLoading,
	getAllJobGrades,
	jobGrades,
	deactivateJobGrades,
}) => {
	const [showAddSubsidiaries, setAddSubsidiaries] = useState({
		show: false,
		edit: false,
		data: {},
	});
	useMount(() => {
		getAllJobGrades();
	});

	return (
		<>
			<NavLayout title="Job Grade" />
			<DashboardSubWrapper className="wrapper-contain">
				<h4 className="page-main-title">Job Grade</h4>
				<div className="row">
					<div className="col-md-3">
						<div className="card main-table-wrapper">
							<div className="card-body">
								<p className="summary-title">No. of Job Grades</p>
								<h3 className="card-summary-value">
									{jobGrades?.count || '...'}
								</h3>
							</div>
						</div>
					</div>
					<div className="col-md-1" />
					<div className="col-md-6" />
				</div>
				<div className="main-table-wrapper mt-5">
					<TableWrap>
						<TableHead>
							<div />
							<button
								type="button"
								className="btn btn-danger table-add-new"
								onClick={() =>
									setAddSubsidiaries((prev) => {
										return { ...prev, show: true, edit: false };
									})
								}
							>
								<Add className="mr-2" /> Add New
							</button>
						</TableHead>

						<TableWrap>
							{!isLoading ? (
								<Table responsive>
									{!isLoading && !isEmpty(jobGrades?.results) ? (
										<>
											{' '}
											<thead>
												<tr>
													<th>S/N</th>
													<th>Name</th>
													<th className="w-35">Description</th>
													<th>Status</th>
													<th className="text-right">Actions</th>
												</tr>
											</thead>
											<tbody>
												{jobGrades?.results?.map((jobGrade, index) => (
													<tr>
														<td>{index + 1}</td>
														<td>{jobGrade.name}</td>
														<td>{trunc(jobGrade.description, 120)}</td>
														<td>
															<span
																className={`status-${
																	jobGrade?.is_active ? 'active' : 'inactive'
																}`}
															>
																{jobGrade?.is_active ? 'Active' : 'Inactive'}
															</span>
														</td>
														<td className="text-right">
															<Dropdown>
																<Dropdown.Toggle as={More} />

																<Dropdown.Menu>
																	<Dropdown.Item
																		href="#!"
																		onClick={() =>
																			setAddSubsidiaries((prev) => {
																				return {
																					...prev,
																					show: true,
																					edit: true,
																					data: jobGrade,
																				};
																			})
																		}
																	>
																		Edit
																	</Dropdown.Item>
																	{jobGrade?.is_active && (
																		<Dropdown.Item
																			href="#!"
																			className="red"
																			onClick={(e) => {
																				e.preventDefault();
																				deactivateJobGrades(jobGrade?.id, true);
																			}}
																		>
																			Deactivate
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
										<p className="text-center mx-auto  mt-5 no-data">
											No Job Grade yet
										</p>
									)}
								</Table>
							) : (
								<Loader loadingText="Getting Job Grades" />
							)}
						</TableWrap>
					</TableWrap>
				</div>
			</DashboardSubWrapper>

			<AddJobGrade
				show={showAddSubsidiaries?.show}
				closeModal={() =>
					setAddSubsidiaries((prev) => {
						return { ...prev, show: false, data: {} };
					})
				}
				data={showAddSubsidiaries?.data}
				isEdit={showAddSubsidiaries?.edit}
			/>
		</>
	);
};

const mapStateToProps = createStructuredSelector({
	isLoading: selectisLoading,
	jobGrades: selectAllJobGrades,
});
export default connect(mapStateToProps, {
	getAllJobGrades,
	deactivateJobGrades,
})(JobGrades);
