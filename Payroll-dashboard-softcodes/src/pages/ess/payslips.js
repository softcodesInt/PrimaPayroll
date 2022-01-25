/* eslint-disable no-return-assign */
/* eslint-disable react/prop-types */
import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { DashboardSubWrapper } from 'pages/dashboard/company-structure';
import { selectAuthUser, selectisLoading } from 'redux/user/selectors';
import NavLayout from 'components/layout/dashboard-layout/navbar';
import { TableWrap } from 'components/layout/dashboard-layout';
import { Table, Button } from 'react-bootstrap';
import { formatAmount } from 'utils';
import BASE_URL from 'services/config';

const Payslips = ({ user }) => {
	return (
		<>
			<NavLayout title="My Details" isBack />
			<DashboardSubWrapper className="wrapper-contain ml-5 mr-5">
				<h4 className="page-main-title">Payslips</h4>

				<div className="main-table-wrapper">
					<TableWrap>
						<Table responsive hover>
							<thead>
								<tr>
									<th>S/N</th>
									<th>Date Paid</th>
									<th>Gross Pay</th>
									<th>Net Pay</th>
									<th>Download</th>
								</tr>
							</thead>
							<tbody>
								{user.payslips?.map((payslip, index) => (
									<tr key={payslip.id}>
										<td>{index + 1}</td>
										<td>{moment(payslip.date_created).format('YYYY-DD-MM')}</td>
										<td>{formatAmount(payslip.net_pay)}</td>
										<td>{formatAmount(payslip.gross_pay)}</td>
										<td>
											<Button
												className="btn btn-info shadow"
												onClick={() =>
													(window.location = `${BASE_URL}/ess/download-payslip/${payslip.id}`)
												}
											>
												Download
											</Button>
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

export default connect(mapStateToProps, {})(Payslips);
