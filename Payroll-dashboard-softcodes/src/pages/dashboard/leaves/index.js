/* eslint-disable no-shadow */
import React, { useRef, useState } from 'react';
import { Dropdown, Table } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useMount } from 'broad-state';
import debounce from 'codewonders-helpers/bundle-cjs/helpers/debounce';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import NavLayout from 'components/layout/dashboard-layout/navbar';
import Input from 'components/input';
import { getAllLeaveCategory, deactivateCategory } from 'redux/leave/actions';

import { TableWrap, TableHead } from 'components/layout/dashboard-layout';
import {
	selectAllCategories,
	selectAllLeaves,
	selectisLoading,
	selectisLoadingCategory,
} from 'redux/leave/selectors';
import Loader from 'components/loader';
import Paginate from 'components/pagination';

import Search from 'assets/icons/icon-search.svg';
import { ReactComponent as More } from 'assets/icons/icon-menu-vertical.svg';
import { ReactComponent as Add } from 'assets/icons/icon-add.svg';
import trunc from 'codewonders-helpers/bundle-cjs/helpers/trunc';
import { isEmpty } from 'codewonders-helpers';
import { DashboardSubWrapper } from '../company-structure';
import AddLeave from './views/add-leave';
import AddCategory from './views/add-category';

const propTypes = {
	getAllLeaveCategory: PropTypes.func,
	deactivateCategory: PropTypes.func,
	leaves: PropTypes.object,
	categories: PropTypes.object,
	isLoading: PropTypes.bool,
	isLoadingCategory: PropTypes.bool,
};
const Leave = ({
	getAllLeaveCategory,
	isLoadingCategory,
	isLoading,
	deactivateCategory,
	leaves,
	categories,
}) => {
	const [showAddCategory, setAddCategory] = useState({
		show: false,
		edit: false,
		data: {},
	});
	const [showAddLeave, setAddLeave] = useState({
		show: false,
		edit: false,
		data: {},
	});

	const [searchStructure, setStructure] = useState('');
	const previousStructureRef = useRef('');

	useMount(() => {
		getAllLeaveCategory();
	});

	const searchStructures = debounce(async (value) => {
		if (previousStructureRef.current === value) {
			try {
				// await refetch();
			} finally {
				await Promise.all([getAllLeaveCategory(value)]);
			}
		}
	}, 500);
	return (
		<>
			<NavLayout title="Leaves" />
			<DashboardSubWrapper className="wrapper-contain">
				<h4 className="page-main-title">Leaves</h4>
				<div className="row">
					<div className="col-md-3">
						<div className="card main-table-wrapper">
							<div className="card-body">
								<p className="summary-title">Leave categories</p>
								<h3 className="card-summary-value">
									{categories?.count || '...'}
								</h3>
							</div>
						</div>
					</div>
					<div className="col-md-3">
						<div className="card">
							<div className="card-body main-table-wrapper">
								<p className="summary-title">Leave Types</p>
								<h3 className="card-summary-value">{leaves?.count || '...'}</h3>
							</div>
						</div>
					</div>
					<div className="col-md-6" />
				</div>
				<div className="main-table-wrapper mt-5">
					<TableWrap>
						<TableHead>
							<Input
								placeholder="search..."
								label=""
								background="#E4E6EB"
								icon={Search}
								value={searchStructure}
								inputClassName="table-search-input"
								onChange={(e) => {
									setStructure(e.target.value);
									previousStructureRef.current = e.target.value;
									searchStructures(e.target.value);
								}}
							/>
							<div>
								<button
									type="button"
									className="btn btn-danger table-add-new"
									onClick={() =>
										setAddCategory((prev) => {
											return { ...prev, show: true, edit: false };
										})
									}
									style={{ float: 'right' }}
								>
									<Add className="mr-2" /> Add Category
								</button>

								<button
									type="button"
									className="btn btn-danger table-add-new"
									onClick={() =>
										setAddLeave((prev) => {
											return { ...prev, show: true, edit: false };
										})
									}
									style={{ marginRight: '20px' }}
								>
									<Add className="mr-2" /> Add Leave
								</button>
							</div>
						</TableHead>
						<TableWrap>
							{' '}
							{!isLoadingCategory ? (
								<Table responsive>
									{!isLoading && !isEmpty(categories?.results) ? (
										<>
											<thead>
												<tr>
													<th>S/N</th>
													<th>Name</th>
													<th>Leave Types</th>
													<th>Description</th>
													<th>Company Policy</th>
													<th>Status</th>
													<th className="text-right">Actions</th>
												</tr>
											</thead>
											<tbody>
												{categories?.results?.map((category, index) => (
													<tr>
														<td>{index + 1}</td>
														<td>
															<Link to={`/dashboard/leaves/${category.id}`}>
																{category.name}
															</Link>
														</td>
														<td>{category.leave_count}</td>
														<td className="w-25">
															{trunc(category?.description, 70)}
														</td>
														<td>
															{category?.company_policy
																?.map((data) => data.name)
																?.join(', ')}
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
																	{' '}
																	<Dropdown.Item
																		as={Link}
																		to={`/dashboard/leaves/${category?.id}`}
																	>
																		View
																	</Dropdown.Item>
																	<Dropdown.Item
																		href="#!"
																		onClick={() =>
																			setAddCategory((prev) => {
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
																	{category?.is_active && (
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
																	)}
																</Dropdown.Menu>
															</Dropdown>
														</td>
													</tr>
												))}
											</tbody>
										</>
									) : (
										<p className="text-center mx-auto mt-5 no-data">
											No Leave Categories Yet
										</p>
									)}
								</Table>
							) : (
								<Loader loadingText="Getting Heads" />
							)}
							<Paginate
								total={categories.total_pages}
								next={categories.next}
								previous={categories.previous}
								currentPage={categories?.current_page}
								getNext={() => getAllLeaveCategory('', '', categories?.next)}
								getPrevious={() =>
									getAllLeaveCategory('', '', categories?.previous)
								}
							/>
						</TableWrap>{' '}
					</TableWrap>
				</div>
			</DashboardSubWrapper>
			<AddCategory
				show={showAddCategory?.show}
				closeModal={() =>
					setAddCategory((prev) => {
						return { ...prev, show: false, data: {} };
					})
				}
				data={showAddCategory.data}
				isEdit={showAddCategory?.edit}
			/>
			<AddLeave
				show={showAddLeave?.show}
				closeModal={() =>
					setAddLeave((prev) => {
						return { ...prev, show: false, data: {} };
					})
				}
				data={showAddLeave.data}
				isEdit={showAddLeave?.edit}
			/>
		</>
	);
};

Leave.propTypes = propTypes;

const mapStateToProps = createStructuredSelector({
	isLoadingHead: selectisLoading,
	leaves: selectAllLeaves,
	isLoadingCategory: selectisLoadingCategory,
	categories: selectAllCategories,
});
export default connect(mapStateToProps, {
	getAllLeaveCategory,

	deactivateCategory,
})(Leave);
