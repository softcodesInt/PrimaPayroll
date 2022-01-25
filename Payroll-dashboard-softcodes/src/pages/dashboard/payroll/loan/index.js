import React, { useState } from 'react';
import { Dropdown, Table } from 'react-bootstrap';

import NavLayout from 'components/layout/dashboard-layout/navbar';
import { ReactComponent as More } from 'assets/icons/icon-menu-vertical.svg';
import { ReactComponent as Add } from 'assets/icons/icon-add.svg';
import { TableWrap, TableHead } from 'components/layout/dashboard-layout';
import { useMount } from 'broad-state';
import { getPayrollLoans } from 'redux/payroll/actions';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectPayrollLoans, selectisLoading } from 'redux/payroll/selectors';
import { isEmpty } from 'codewonders-helpers';
import Loader from 'components/loader';
import { formatAmount } from 'utils';
import { DashboardSubWrapper } from '../../company-structure';
import AddLoan from './add-loan';

const Loans = ({ isLoading, getPayrollLoans, loans, deactivateBank }) => {
	const [showAddSubsidiaries, setAddSubsidiaries] = useState({
		show: false,
		edit: false,
		data: {},
	});
	useMount(() => {
		getPayrollLoans();
	});

	return (
		<>
			<NavLayout title="Loans" />
			<DashboardSubWrapper className="wrapper-contain">
				<h4 className="page-main-title">Loans</h4>
				<div className="row">
					<div className="col-md-3">
						<div className="card main-table-wrapper">
							<div className="card-body">
								<p className="summary-title">No. of Loans</p>
								<h3 className="card-summary-value">{loans?.count || '...'}</h3>
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
									{!isLoading && !isEmpty(loans?.results) ? (
										<>
											{' '}
											<thead>
												<tr>
													<th>Employee</th>
													<th>Amount</th>
													<th>Loan Value</th>
													<th>Interest Rate</th>
													<th>Start Date</th>
													<th>End Date</th>
													<th>Next Repayment Amount</th>
													<th>Status</th>
													<th className="text-right">Actions</th>
												</tr>
											</thead>
											<tbody>
												{loans?.results?.map((loan, index) => (
													<tr>
														<td>
															{loan.employee.first_name}{' '}
															{loan.employee.last_name}
														</td>
														<td>{formatAmount(loan.amount)}</td>
														<td>{formatAmount(loan.total_loan_value)}</td>
														<td>{loan.interest_rate}%</td>
														<td>{loan.start_date}</td>
														<td>{loan.end_date}</td>
														<td>{formatAmount(loan.next_repayment_amount)}</td>
														<td>
															<span
																className={`status-${
																	loan?.is_active ? 'active' : 'inactive'
																}`}
															>
																{loan?.is_active ? 'Active' : 'Inactive'}
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
																					data: loan,
																				};
																			})
																		}
																	>
																		Edit
																	</Dropdown.Item>
																	{loan?.is_active && (
																		<Dropdown.Item
																			href="#!"
																			className="red"
																			onClick={(e) => {
																				e.preventDefault();
																				// deactivateBank(loan?.id, true);
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
											No Loans Yet
										</p>
									)}
								</Table>
							) : (
								<Loader loadingText="Getting Loans" />
							)}
						</TableWrap>
					</TableWrap>
				</div>
			</DashboardSubWrapper>

			<AddLoan
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
	loans: selectPayrollLoans,
});
export default connect(mapStateToProps, {
	getPayrollLoans,
})(Loans);
