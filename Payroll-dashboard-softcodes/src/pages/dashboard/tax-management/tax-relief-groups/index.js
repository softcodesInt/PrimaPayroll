import React, { useState } from 'react';
import { Dropdown, Table } from 'react-bootstrap';

import NavLayout from 'components/layout/dashboard-layout/navbar';
import { ReactComponent as More } from 'assets/icons/icon-menu-vertical.svg';
import { ReactComponent as Add } from 'assets/icons/icon-add.svg';
import { TableWrap, TableHead } from 'components/layout/dashboard-layout';

import { DashboardSubWrapper } from 'pages/dashboard/company-structure';
import {
	getAllTaxReliefGroups,
	deactivateTaxReliefGroup,
} from 'redux/tax-management/actions';
import Paginate from 'components/pagination';
import { useMount } from 'broad-state';
import Loader from 'components/loader';
import {
	selectAllTaxReliefGroups,
	selectisLoadingTaxReliefGroup,
} from 'redux/tax-management/selectors';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { isEmpty } from 'codewonders-helpers';
import { getAllCompanyPolicy } from 'redux/company-policy/actions';
import AddReliefGroup from './add-relief-group';

const TaxReliefGroup = ({
	noNav = false,
	getAllTaxReliefGroups,
	isLoading,
	reliefGroups,
	deactivateTaxReliefGroup,
	getAllCompanyPolicy,
}) => {
	const [showReliefGroup, setShowReliefGroup] = useState({
		show: false,
		edit: false,
		data: {},
	});

	useMount(() => {
		getAllTaxReliefGroups();
		getAllCompanyPolicy();
	});

	return (
		<>
			{!noNav && <NavLayout title="Tax Relief Group" isBack />}
			<DashboardSubWrapper className="wrapper-contain">
				<h4 className="page-main-title">Tax Relief Group</h4>
				<div className="main-table-wrapper">
					<TableWrap>
						<TableHead>
							<div />
							<button
								type="button"
								className="btn btn-danger table-add-new"
								onClick={() =>
									setShowReliefGroup((prev) => {
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
									{!isLoading && !isEmpty(reliefGroups?.results) ? (
										<>
											{' '}
											<thead>
												<tr>
													<th>S/N</th>
													<th>Name</th>
													<th>Description</th>
													<th>Company Policy</th>
													<th>Status</th>
													<th className="text-right">Actions</th>
												</tr>
											</thead>
											<tbody>
												{reliefGroups?.results?.map((tax, index) => (
													<tr>
														<td>{index + 1}</td>
														<td>{tax?.name}</td>
														<td className="w-32">{tax?.description}</td>
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
																			setShowReliefGroup((prev) => {
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
																				deactivateTaxReliefGroup(tax?.id, true);
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
											No Tax Relief Group Yet
										</p>
									)}
								</Table>
							) : (
								<Loader loadingText="Getting Tax Relief Group..." />
							)}{' '}
							<Paginate
								total={reliefGroups?.total_pages}
								next={reliefGroups?.next}
								currentPage={reliefGroups?.current_page}
								previous={reliefGroups?.previous}
								getData={getAllTaxReliefGroups}
								getNext={() =>
									getAllTaxReliefGroups('', '', reliefGroups?.next)
								}
								getPrevious={() =>
									getAllTaxReliefGroups('', '', reliefGroups?.previous)
								}
							/>
						</TableWrap>
					</TableWrap>
				</div>
			</DashboardSubWrapper>
			<AddReliefGroup
				show={showReliefGroup?.show}
				closeModal={() =>
					setShowReliefGroup((prev) => {
						return { ...prev, show: false, data: {} };
					})
				}
				data={showReliefGroup?.data}
				isEdit={showReliefGroup?.edit}
			/>
		</>
	);
};

const mapStateToProps = createStructuredSelector({
	isLoading: selectisLoadingTaxReliefGroup,
	reliefGroups: selectAllTaxReliefGroups,
});
export default connect(mapStateToProps, {
	getAllTaxReliefGroups,
	deactivateTaxReliefGroup,
	getAllCompanyPolicy,
})(TaxReliefGroup);
