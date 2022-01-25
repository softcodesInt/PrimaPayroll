/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React, { useEffect } from 'react';
import { Dropdown, Table } from 'react-bootstrap';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { isEmpty } from 'codewonders-helpers';
import moment from 'moment';
/* -------------------------- Internal Dependencies ------------------------- */
import NavLayout from 'components/layout/dashboard-layout/navbar';
import Loader from 'components/loader';
/* --------------------------- Image Dependencies --------------------------- */

import { ReactComponent as More } from 'assets/icons/icon-menu-vertical.svg';
import { TableWrap, TableHead } from 'components/layout/dashboard-layout';
import { DashboardSubWrapper } from 'pages/dashboard/company-structure';
import { getPayPeriod, makePayPeriodActive } from 'redux/payroll/actions';
import { selectAllPayPeriod, selectisLoading } from 'redux/payroll/selectors';

const PayPeriod = ({
	noNav = false,
	match,
	getPayPeriod,
	isLoading,
	payPeriods,
	makePayPeriodActive,
}) => {
	const policyId = match.params.id;
	useEffect(() => {
		getPayPeriod(policyId);
		// eslint-disable-next-line
	}, []);
	return (
		<>
			{!noNav && <NavLayout title="Pay Period" isBack></NavLayout>}
			<DashboardSubWrapper className="wrapper-contain">
				<SectionHeadsnItems>
					<TableHead className="mt-5">
						<div className="d-flex align-items-center">
							<h4 className="mr-3">Pay period</h4>
						</div>
					</TableHead>
					<TableWrap>
						{isLoading ? (
							<Loader loadingText="Getting Pay Periods" />
						) : (
							<Table responsive>
								<thead>
									<tr>
										<th>S/N</th>
										<th>Period</th>
										<th>Number of work days</th>
										<th>Status</th>
										<th className="text-right">Actions</th>
									</tr>
								</thead>
								<tbody>
									{!isEmpty(payPeriods) &&
										payPeriods.map((data, index) => (
											<tr key={data.id}>
												<td>{index + 1}</td>
												<td>
													{moment(data.period_month).format('MMMM, YYYY')}
												</td>
												<td>{data.number_of_days}</td>
												<td>{data.status}</td>
												<td className="text-right">
													<Dropdown>
														{data.status === 'Live' && (
															<>
																<Dropdown.Toggle as={More} />
																<Dropdown.Menu>
																	<Dropdown.Item
																		onClick={(e) =>
																			makePayPeriodActive(data.id)
																		}
																	>
																		Pay
																	</Dropdown.Item>
																</Dropdown.Menu>
															</>
														)}
													</Dropdown>
												</td>
											</tr>
										))}
								</tbody>
							</Table>
						)}
					</TableWrap>
				</SectionHeadsnItems>
			</DashboardSubWrapper>
		</>
	);
};

const SectionHeadsnItems = styled.div`
	margin-top: 4rem;
`;

const mapStateToProps = createStructuredSelector({
	isLoading: selectisLoading,
	payPeriods: selectAllPayPeriod,
});
export default connect(mapStateToProps, { getPayPeriod, makePayPeriodActive })(
	PayPeriod
);
