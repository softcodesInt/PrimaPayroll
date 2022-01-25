/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React, { useState, useRef } from 'react';
import { Dropdown, Table } from 'react-bootstrap';
/* -------------------------- Internal Dependencies ------------------------- */
import NavLayout from 'components/layout/dashboard-layout/navbar';

/* --------------------------- Image Dependencies --------------------------- */

import { ReactComponent as More } from 'assets/icons/icon-menu-vertical.svg';
import { ReactComponent as Add } from 'assets/icons/icon-add.svg';
import Search from 'assets/icons/icon-search.svg';
import { TableWrap, TableHead } from 'components/layout/dashboard-layout';
import Input from 'components/input';
import debounce from 'codewonders-helpers/bundle-cjs/helpers/debounce';

import { DashboardSubWrapper } from 'pages/dashboard/company-structure';

import { deactivatePayroll, getAllPayrolls } from 'redux/payroll/actions';
import { isEmpty } from 'codewonders-helpers';
import { selectAllPayroll, selectisLoading } from 'redux/payroll/selectors';
import { connect } from 'react-redux';
import Paginate from 'components/pagination';
import Loader from 'components/loader';
import { createStructuredSelector } from 'reselect';
import { capitalize } from 'utils';
import AddPayrollElement, { type_map } from './add-payroll';

const PayrollElement = ({
	noNav = false,
	getAllPayrolls,
	isLoading,
	deactivatePayroll,
	payroll_data,
	type,
}) => {
	const [showAddPayrollElement, setAddPayrollElement] = useState({
		show: false,
		edit: false,
		data: {},
	});

	const searchPayroll = debounce(async (value) => {
		if (previousStructureRef.current === value) {
			try {
				// await refetch();
			} finally {
				await getAllPayrolls(value, 1, null, type);
			}
		}
	}, 500);

	const previousStructureRef = useRef('');
	const [searchElement, setSearchElement] = useState('');

	return (
		<>
			{!noNav && (
				<NavLayout
					title={`${capitalize(type?.replace(/[^a-zA-Z ]/g, ' '))}`}
					isBack
				/>
			)}
			<DashboardSubWrapper className="wrapper-contain">
				<h4 className="page-main-title">{`${capitalize(
					type?.replace(/[^a-zA-Z ]/g, ' ')
				)}`}</h4>
				<div className="main-table-wrapper">
					<TableWrap>
						<TableHead>
							<Input
								placeholder={`Search ${capitalize(
									type?.replace(/[^a-zA-Z ]/g, ' ')
								)}`}
								label=""
								background="#E4E6EB"
								icon={Search}
								value={searchElement}
								onChange={(e) => {
									setSearchElement(e.target.value);
									previousStructureRef.current = e.target.value;
									searchPayroll(e.target.value);
								}}
								inputClassName="table-search-input"
							/>
							<button
								type="button"
								className="btn btn-danger table-add-new"
								onClick={() =>
									setAddPayrollElement((prev) => {
										return { ...prev, show: true, edit: false };
									})
								}
							>
								<Add className="mr-2" /> Add new
							</button>
						</TableHead>
						<TableWrap>
							{!isLoading ? (
								<Table responsive>
									{!isLoading && !isEmpty(payroll_data?.results) ? (
										<>
											{' '}
											<thead>
												<tr>
													<th>S/N</th>
													<th>Name</th>
													<th>Calculation Type</th>
													<th>When To Pay</th>
													<th>Earning Type</th>
													<th>Payroll Group</th>
													<th>Mandatory</th>
													<th>Pro rata</th>
													<th>Status</th>
													<th className="text-right">Actions</th>
												</tr>
											</thead>
											<tbody>
												{payroll_data?.results?.map((payroll, index) => (
													<tr>
														<td>{index + 1}</td>
														<td>{payroll?.name}</td>
														<td>{payroll?.calculation_type}</td>
														<td>{payroll.when_to_pay}</td>
														<td>{payroll.earning_type}</td>
														<td>{payroll?.category?.name}</td>
														<td>{payroll?.mandatory ? 'YES' : 'NO'}</td>
														<td>{payroll?.prorata ? 'YES' : 'NO'}</td>
														<td>
															<span
																className={`status-${
																	payroll?.is_active ? 'active' : 'inactive'
																}`}
															>
																{payroll?.is_active ? 'Active' : 'Inactive'}
															</span>
														</td>
														<td className="text-right">
															<Dropdown>
																<Dropdown.Toggle as={More} />

																<Dropdown.Menu>
																	<Dropdown.Item
																		href="#!"
																		onClick={() =>
																			setAddPayrollElement((prev) => {
																				return {
																					...prev,
																					show: true,
																					edit: 'view',
																					data: payroll,
																				};
																			})
																		}
																	>
																		View
																	</Dropdown.Item>
																	<Dropdown.Item
																		href="#!"
																		onClick={() =>
																			setAddPayrollElement((prev) => {
																				return {
																					...prev,
																					show: true,
																					edit: true,
																					data: payroll,
																				};
																			})
																		}
																	>
																		Edit
																	</Dropdown.Item>
																	<Dropdown.Item
																		href="#!"
																		className="red"
																		onClick={(e) => {
																			e.preventDefault();
																			deactivatePayroll(
																				payroll?.id,
																				type_map[type]
																			);
																		}}
																	>
																		Deactivate
																	</Dropdown.Item>
																</Dropdown.Menu>
															</Dropdown>
														</td>
													</tr>
												))}
											</tbody>
										</>
									) : (
										<p className="text-center m-auto no-data">
											No {capitalize(type?.replace(/[^a-zA-Z ]/g, ' '))} Yet
										</p>
									)}
								</Table>
							) : (
								<Loader
									loadingText={`Getting ${capitalize(
										type?.replace(/[^a-zA-Z ]/g, ' ')
									)}...`}
								/>
							)}{' '}
							<Paginate
								total={payroll_data?.total_pages}
								next={payroll_data?.next}
								currentPage={payroll_data?.current_page}
								previous={payroll_data?.previous}
								getData={getAllPayrolls}
								getNext={() =>
									getAllPayrolls('', '', payroll_data?.next, type_map[type])
								}
								getPrevious={() =>
									getAllPayrolls('', '', payroll_data?.previous, type_map[type])
								}
							/>{' '}
						</TableWrap>
					</TableWrap>
				</div>
			</DashboardSubWrapper>
			<AddPayrollElement
				show={showAddPayrollElement?.show}
				closeModal={() =>
					setAddPayrollElement((prev) => {
						return { ...prev, show: false, data: {} };
					})
				}
				isEdit={showAddPayrollElement?.edit}
				data={showAddPayrollElement?.data}
				type={type}
			/>
		</>
	);
};

const mapStateToProps = createStructuredSelector({
	isLoading: selectisLoading,
	payroll_data: selectAllPayroll,
});
export default connect(mapStateToProps, {
	getAllPayrolls,
	deactivatePayroll,
})(PayrollElement);
