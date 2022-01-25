/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React, { useState } from 'react';
import { Dropdown, Table } from 'react-bootstrap';
import styled from 'styled-components';
/* -------------------------- Internal Dependencies ------------------------- */
import NavLayout from 'components/layout/dashboard-layout/navbar';

/* --------------------------- Image Dependencies --------------------------- */
import { ReactComponent as More } from 'assets/icons/icon-menu-vertical.svg';
import { ReactComponent as Add } from 'assets/icons/icon-add.svg';
import { TableWrap, TableHead } from 'components/layout/dashboard-layout';

import { DashboardSubWrapper } from 'pages/dashboard/company-structure';
import {
	deactivateTaxTable,
	getAllTaxTable,
} from 'redux/company-policy/actions';
import Paginate from 'components/pagination';
import { useMount } from 'broad-state';
import Loader from 'components/loader';
import {
	selectAllTaxTable,
	selectisLoadingTaxTable,
} from 'redux/company-policy/selectors';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { isEmpty } from 'codewonders-helpers';
import { formatAmount } from 'utils';
import AddTax from './add-tax';

const TaxTable = ({
	noNav = false,
	getAllTaxTable,
	isLoading,
	tax_table,
	deactivateTaxTable,
}) => {
	const [showAddTax, setAddTax] = useState({
		show: false,
		edit: false,
		data: {},
	});

	useMount(() => {
		getAllTaxTable();
	});

	return (
		<>
			{!noNav && <NavLayout title="Tax Table" isBack />}
			<DashboardSubWrapper className="wrapper-contain">
				<SectionHeadsnItems>
					<TableHead className="mt-5">
						<div className="d-flex align-items-center">
							<h4 className="page-main-title">Tax Table</h4>
						</div>
						<button
							type="button"
							className="btn btn-danger table-add-new"
							onClick={() =>
								setAddTax((prev) => {
									return { ...prev, show: true, edit: false };
								})
							}
						>
							<Add className="mr-2" /> Add a new tax
						</button>
					</TableHead>

					<TableWrap>
						{!isLoading ? (
							<Table responsive>
								{!isLoading && !isEmpty(tax_table?.results) ? (
									<>
										{' '}
										<thead>
											<tr>
												<th>S/N</th>
												<th>Income From</th>
												<th>Income To</th>
												<th>Tax Rate</th>
												<th>Company Policy</th>
												<th>Status</th>
												<th className="text-right">Actions</th>
											</tr>
										</thead>
										<tbody>
											{tax_table?.results?.map((tax, index) => (
												<tr>
													<td>{index + 1}</td>
													<td>{formatAmount(tax?.income_from)}</td>
													<td className="w-32">
														{formatAmount(tax?.income_to)}
													</td>
													<td>{tax?.tax_rate}</td>
													<td>{tax?.company_policy?.name}</td>
													<td>
														<span
															className={`status-${
																tax?.is_active ? 'active' : 'inactive'
															}`}
														>
															{tax?.is_active ? 'Active' : 'Inactive'}
														</span>
													</td>
													<td className="text-right">
														<Dropdown>
															<Dropdown.Toggle as={More} />

															<Dropdown.Menu>
																<Dropdown.Item
																	href="#!"
																	onClick={() =>
																		setAddTax((prev) => {
																			return {
																				...prev,
																				show: true,
																				edit: true,
																				data: tax,
																			};
																		})
																	}
																>
																	Edit
																</Dropdown.Item>
																{tax?.is_active && (
																	<Dropdown.Item
																		href="#!"
																		className="red"
																		onClick={(e) => {
																			e.preventDefault();
																			deactivateTaxTable(tax?.id, true);
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
									<p className="text-center m-auto no-data">No Tax Table Yet</p>
								)}
							</Table>
						) : (
							<Loader loadingText="Getting Tax Table..." />
						)}{' '}
						<Paginate
							total={tax_table?.total_pages}
							next={tax_table?.next}
							currentPage={tax_table?.current_page}
							previous={tax_table?.previous}
							getData={getAllTaxTable}
							getNext={() => getAllTaxTable('', '', tax_table?.next)}
							getPrevious={() => getAllTaxTable('', '', tax_table?.previous)}
						/>
					</TableWrap>
				</SectionHeadsnItems>
			</DashboardSubWrapper>
			<AddTax
				show={showAddTax?.show}
				closeModal={() =>
					setAddTax((prev) => {
						return { ...prev, show: false, data: {} };
					})
				}
				data={showAddTax?.data}
				isEdit={showAddTax?.edit}
			/>
		</>
	);
};

const SectionHeadsnItems = styled.div`
	margin-top: 4rem;
`;

const mapStateToProps = createStructuredSelector({
	isLoading: selectisLoadingTaxTable,
	tax_table: selectAllTaxTable,
});
export default connect(mapStateToProps, {
	getAllTaxTable,
	deactivateTaxTable,
})(TaxTable);
