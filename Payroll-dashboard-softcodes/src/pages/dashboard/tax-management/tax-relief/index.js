import React, { useState } from 'react';
import { Dropdown, Table } from 'react-bootstrap';
import NavLayout from 'components/layout/dashboard-layout/navbar';
import { ReactComponent as More } from 'assets/icons/icon-menu-vertical.svg';
import { ReactComponent as Add } from 'assets/icons/icon-add.svg';
import { TableWrap, TableHead } from 'components/layout/dashboard-layout';

import { DashboardSubWrapper } from 'pages/dashboard/company-structure';
import {
	getAllTaxReliefs,
	deactivateTaxRelief,
} from 'redux/tax-management/actions';
import Paginate from 'components/pagination';
import { useMount } from 'broad-state';
import Loader from 'components/loader';
import {
	selectAllTaxRelief,
	selectisLoadingTaxRelief,
} from 'redux/tax-management/selectors';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { isEmpty } from 'codewonders-helpers';
import AddRelief from './add-relief';

const TaxRelief = ({
	noNav = false,
	getAllTaxReliefs,
	isLoading,
	reliefs,
	deactivateTaxRelief,
}) => {
	const [showRelief, setShowRelief] = useState({
		show: false,
		edit: false,
		data: {},
	});

	useMount(() => {
		getAllTaxReliefs();
	});

	return (
		<>
			{!noNav && <NavLayout title="Tax Relief" isBack />}
			<DashboardSubWrapper className="wrapper-contain">
				<h4 className="page-main-title">Tax Relief</h4>
				<div className="main-table-wrapper">
					<TableWrap>
						<TableHead>
							<div />
							<button
								type="button"
								className="btn btn-danger table-add-new"
								onClick={() =>
									setShowRelief((prev) => {
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
									{!isLoading && !isEmpty(reliefs?.results) ? (
										<>
											{' '}
											<thead>
												<tr>
													<th>S/N</th>
													<th>Name</th>
													<th>Calculation Type</th>
													<th>Calculation Type Value</th>
													<th>Payroll Elements</th>
													<th>Relief Group</th>
													<th>Status</th>
													<th className="text-right">Actions</th>
												</tr>
											</thead>
											<tbody>
												{reliefs?.results?.map((reliefs, index) => (
													<tr>
														<td>{index + 1}</td>
														<td>{reliefs?.name}</td>
														<td>{reliefs?.calculation_type}</td>
														<td>{reliefs?.calculation_type_value}</td>
														<td>
															{reliefs?.payroll_lines
																?.map((data) => data.name)
																?.join(', ')}
														</td>
														<td>{reliefs?.relief_group?.name}</td>
														<td>
															<span
																className={`status-${
																	reliefs?.is_active ? 'active' : 'inactive'
																}`}
															>
																{reliefs?.is_active ? 'Active' : 'Inactive'}
															</span>
														</td>
														<td className="text-right">
															<Dropdown>
																<Dropdown.Toggle as={More} />

																<Dropdown.Menu>
																	<Dropdown.Item
																		href="#!"
																		onClick={() =>
																			setShowRelief((prev) => {
																				return {
																					...prev,
																					show: true,
																					edit: true,
																					data: reliefs,
																				};
																			})
																		}
																	>
																		Edit
																	</Dropdown.Item>
																	{reliefs?.is_active && (
																		<Dropdown.Item
																			href="#!"
																			className="red"
																			onClick={(e) => {
																				e.preventDefault();
																				deactivateTaxRelief(reliefs?.id, true);
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
										<p className="text-center m-auto no-data">
											No Tax Relief Yet
										</p>
									)}
								</Table>
							) : (
								<Loader loadingText="Getting Tax Relief..." />
							)}{' '}
							<Paginate
								total={reliefs?.total_pages}
								next={reliefs?.next}
								currentPage={reliefs?.current_page}
								previous={reliefs?.previous}
								getData={getAllTaxReliefs}
								getNext={() => getAllTaxReliefs('', '', reliefs?.next)}
								getPrevious={() => getAllTaxReliefs('', '', reliefs?.previous)}
							/>
						</TableWrap>
					</TableWrap>
				</div>
			</DashboardSubWrapper>
			<AddRelief
				show={showRelief?.show}
				closeModal={() =>
					setShowRelief((prev) => {
						return { ...prev, show: false, data: {} };
					})
				}
				data={showRelief?.data}
				isEdit={showRelief?.edit}
			/>
		</>
	);
};

const mapStateToProps = createStructuredSelector({
	isLoading: selectisLoadingTaxRelief,
	reliefs: selectAllTaxRelief,
});
export default connect(mapStateToProps, {
	getAllTaxReliefs,
	deactivateTaxRelief,
})(TaxRelief);
