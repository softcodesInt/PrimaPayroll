/* eslint-disable no-return-assign */
/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { DashboardSubWrapper } from 'pages/dashboard/company-structure';
import { selectAuthUser, selectisLoading } from 'redux/user/selectors';
import NavLayout from 'components/layout/dashboard-layout/navbar';
import { TableWrap } from 'components/layout/dashboard-layout';
import { Table } from 'react-bootstrap';

const Leaves = ({ user }) => {
	return (
		<>
			<NavLayout title="My Details" isBack />
			<DashboardSubWrapper className="wrapper-contain ml-5 mr-5">
				<h4 className="page-main-title">Available Leaves</h4>

				<div className="main-table-wrapper">
					<TableWrap>
						<Table responsive hover>
							<thead>
								<tr>
									<th>S/N</th>
									<th>Leave Type</th>
									<th>Entitled Days</th>
									<th>Available Days</th>
									<th>Status</th>
								</tr>
							</thead>
							<tbody>
								{user.employee_leaves?.map((leave, index) => (
									<tr key={leave.id}>
										<td>{index + 1}</td>
										<td>{leave.name}</td>
										<td>{leave.entitlement_days}</td>
										<td>{leave.days_left}</td>
										<td>
											<span
												className={`status-${
													leave.active ? 'active' : 'inactive'
												}`}
											>
												{leave?.active ? 'Available' : 'Exhausted'}
											</span>
										</td>
									</tr>
								))}
							</tbody>
						</Table>
					</TableWrap>
				</div>
			</DashboardSubWrapper>
			<DashboardSubWrapper className="wrapper-contain ml-5 mr-5">
				<h4 className="page-main-title">Leave Applications</h4>

				<div className="main-table-wrapper">
					<TableWrap>
						<Table responsive hover>
							<thead>
								<tr>
									<th>S/N</th>
									<th>Leave Type</th>
									<th>Start Date</th>
									<th>End Date</th>
									<th>Number Of Days</th>
									<th>Status</th>
								</tr>
							</thead>
							<tbody>
								{user.employee_leave_applications?.map((leave, index) => (
									<tr key={leave.id}>
										<td>{index + 1}</td>
										<td>{leave?.leave?.name}</td>
										<td>{leave.start_date}</td>
										<td>{leave.end_date}</td>
										<td>{leave.number_of_days}</td>
										<td>
											<span
												className={`status-${
													leave.status === 'APPROVED' ||
													leave.status === 'REQUEST'
														? 'active'
														: 'inactive'
												}`}
											>
												{leave?.status}
											</span>
										</td>
									</tr>
								))}
							</tbody>
						</Table>
					</TableWrap>
				</div>
			</DashboardSubWrapper>
		</>
	);
};

const mapStateToProps = createStructuredSelector({
	isLoading: selectisLoading,
	user: selectAuthUser,
});

export default connect(mapStateToProps, {})(Leaves);
