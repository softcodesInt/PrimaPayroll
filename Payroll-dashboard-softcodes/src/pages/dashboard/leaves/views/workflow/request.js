/* eslint-disable react/button-has-type */
/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React from 'react';
import styled from 'styled-components';
/* -------------------------- Internal Dependencies ------------------------- */
import NavLayout from 'components/layout/dashboard-layout/navbar';
import { useMount } from 'broad-state';
import { DashboardSubWrapper } from 'pages/dashboard/company-structure';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { isEmpty } from 'codewonders-helpers';
import { TableWrap } from 'components/layout/dashboard-layout';

import { Button, Table } from 'react-bootstrap';
import {
	selectisLoading,
	selectEmployeesLeaveRequests,
} from 'redux/leave/selectors';
import {
	getEmployeesLeaveRequests,
	approveRejectLeaveRequest,
} from 'redux/leave/actions';
import Loader from 'components/loader';

const LeaveWorkflowRequest = ({
	isLoading,
	getEmployeesLeaveRequests,
	approveRejectLeaveRequest,
	leaveRequests,
}) => {
	useMount(() => {
		getEmployeesLeaveRequests();
	});

	return (
		<>
			<NavLayout title="Leave Workflow" isBack />
			<DashboardSubWrapper className="wrapper-contain">
				<h4 className="page-main-title">Manage Employee Leave Request</h4>
				<div className="main-table-wrapper mt-5">
					<SectionHeadsnItems>
						<p className="summary-title">
							You can either approve or reject an employee leave request
						</p>
						<div className="row">
							<div className="col-sm-12">
								<TableWrap>
									{' '}
									{!isLoading ? (
										<Table responsive>
											{!isLoading && !isEmpty(leaveRequests) ? (
												<>
													<thead>
														<tr>
															<th>S/N</th>
															<th>Employee</th>
															<th>Leave Type</th>
															<th>Start Date</th>
															<th>End Date</th>
															<th>Number of Days</th>
															<th className="text-right">Actions</th>
														</tr>
													</thead>
													<tbody>
														{leaveRequests?.map((request, index) => (
															<tr>
																<td>{index + 1}</td>
																<td>
																	<Link
																		to={`/dashboard/employee/detail/${request.employee.id}`}
																	>
																		{request.employee.name}
																	</Link>
																</td>
																<td>{request.leave.name}</td>
																<td>{request.start_date}</td>
																<td>{request.end_date}</td>
																<td>{request.number_of_days}</td>
																<td className="text-right">
																	<Button
																		className="btn btn-primary table-approve mr-4"
																		onClick={() =>
																			approveRejectLeaveRequest(
																				request.id,
																				false
																			)
																		}
																	>
																		Approve
																	</Button>
																	<Button
																		className="btn btn-danger table-add-new"
																		onClick={() =>
																			approveRejectLeaveRequest(
																				request.id,
																				true
																			)
																		}
																	>
																		Reject
																	</Button>
																</td>
															</tr>
														))}
													</tbody>
												</>
											) : (
												<p className="text-center mx-auto mt-5 no-data">
													No Leave Requests Yet
												</p>
											)}
										</Table>
									) : (
										<Loader loadingText="Getting Leave Requests" />
									)}
								</TableWrap>{' '}
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
	leaveRequests: selectEmployeesLeaveRequests,
});

const mapDispatchToProps = (dispatch) => {
	return {
		dispatch: (data) => dispatch(data),
		getEmployeesLeaveRequests: (data) =>
			dispatch(getEmployeesLeaveRequests(data)),
		approveRejectLeaveRequest: (id, status) =>
			dispatch(approveRejectLeaveRequest(id, status)),
	};
};
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(LeaveWorkflowRequest);
