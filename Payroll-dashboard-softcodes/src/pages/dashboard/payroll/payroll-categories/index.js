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
	deactivateCategory,
	getAllPayrollCategory,
} from 'redux/payroll/actions';
import { isEmpty } from 'codewonders-helpers';
import {
	selectAllCategories,
	selectisLoadingCategory,
} from 'redux/payroll/selectors';
import { connect } from 'react-redux';
import Paginate from 'components/pagination';
import Loader from 'components/loader';
import { createStructuredSelector } from 'reselect';
import { useMount } from 'broad-state';
import { getAllCompanyPolicy } from 'redux/company-policy/actions';
import AddPayrollCategories from './add-payroll-category';

const PayrollCategories = ({
	noNav = false,
	getAllPayrollCategory,
	isLoading,
	deactivateCategory,
	categories,
	getAllCompanyPolicy,
}) => {
	const [showAddPayrollCategories, setAddPayrollCategories] = useState({
		show: false,
		edit: false,
	});

	useMount(() => {
		getAllPayrollCategory();
		getAllCompanyPolicy();
	});

	return (
		<>
			{!noNav && <NavLayout title="Payroll Groups" isBack />}
			<DashboardSubWrapper className="wrapper-contain">
				<SectionHeadsnItems>
					<TableHead className="mt-5">
						<div className="d-flex align-items-center">
							<h4 className="mr-3">
								Payroll Groups ({categories?.results?.length})
							</h4>
							<Dropdown className="sorter">
								<Dropdown.Toggle id="dropdown-basic">sort by</Dropdown.Toggle>

								<Dropdown.Menu>
									<Dropdown.Item href="#/action-1">Action</Dropdown.Item>
									<Dropdown.Item href="#/action-2">
										Another action
									</Dropdown.Item>
									<Dropdown.Item href="#/action-3">
										Something else
									</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
						</div>
						<button
							type="button"
							className="btn btn-primary"
							onClick={() =>
								setAddPayrollCategories((prev) => {
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
								{!isLoading && !isEmpty(categories?.results) ? (
									<>
										{' '}
										<thead>
											<tr>
												<th>S/N</th>
												<th>Name</th>
												<th>Description</th>
												<th>Company Policy</th>
												<th>Created By</th>
												<th>Status</th>
												<th className="text-right">Actions</th>
											</tr>
										</thead>
										<tbody>
											{categories?.results?.map((category, index) => (
												<tr>
													<td>{index + 1}</td>
													<td>{category?.name}</td>
													<td className="w-32">{category?.description}</td>
													<td>{category?.company_policy?.name}</td>
													<td>
														{category?.created_by?.user?.first_name}{' '}
														{category?.created_by?.user?.last_name}
													</td>
													<td>
														<span
															className={`status-${
																category?.is_active ? 'active' : 'inactive'
															}`}
														>
															{category?.is_active ? 'Active' : 'Inactive'}
														</span>
													</td>
													<td className="text-right">
														<Dropdown>
															<Dropdown.Toggle as={More} />

															<Dropdown.Menu>
																<Dropdown.Item
																	href="#!"
																	onClick={() =>
																		setAddPayrollCategories((prev) => {
																			return {
																				...prev,
																				show: true,
																				edit: true,
																				data: category,
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
																		deactivateCategory(category?.id, true);
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
										No Payroll Groups Yet
									</p>
								)}
							</Table>
						) : (
							<Loader loadingText="Getting Payroll Groups..." />
						)}{' '}
						<Paginate
							total={categories?.total_pages}
							next={categories?.next}
							currentPage={categories?.current_page}
							previous={categories?.previous}
							getData={getAllPayrollCategory}
							getNext={() => getAllPayrollCategory('', '', categories?.next)}
							getPrevious={() =>
								getAllPayrollCategory('', '', categories?.previous)
							}
						/>{' '}
					</TableWrap>
				</SectionHeadsnItems>
			</DashboardSubWrapper>
			<AddPayrollCategories
				show={showAddPayrollCategories?.show}
				closeModal={() =>
					setAddPayrollCategories((prev) => {
						return { ...prev, show: false };
					})
				}
				isEdit={showAddPayrollCategories?.edit}
				data={showAddPayrollCategories?.data}
			/>
		</>
	);
};

const SectionHeadsnItems = styled.div`
	margin-top: 4rem;
`;

const mapStateToProps = createStructuredSelector({
	isLoading: selectisLoadingCategory,
	categories: selectAllCategories,
});
export default connect(mapStateToProps, {
	getAllPayrollCategory,
	deactivateCategory,
	getAllCompanyPolicy,
})(PayrollCategories);
