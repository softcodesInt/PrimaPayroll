/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React, { useRef, useState } from 'react';
import { Dropdown, Table } from 'react-bootstrap';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import trunc from 'codewonders-helpers/bundle-cjs/helpers/trunc';
import debounce from 'codewonders-helpers/bundle-cjs/helpers/debounce';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useMount } from 'broad-state';
import PropTypes from 'prop-types';

/* -------------------------- Internal Dependencies ------------------------- */
import NavLayout from 'components/layout/dashboard-layout/navbar';
import Input from 'components/input';
import Paginate from 'components/pagination';
import {
	getAllHeads,
	deactivateHeadOrItemById,
} from 'redux/company-structure/actions';
import {
	selectAllHeads,
	selectAllItems,
	selectisLoadingHead,
	selectisLoadingItem,
} from 'redux/company-structure/selectors';
import { TableWrap, TableHead } from 'components/layout/dashboard-layout';
import Loader from 'components/loader';

/* --------------------------- Image Dependencies --------------------------- */
import Search from 'assets/icons/icon-search.svg';
import { ReactComponent as More } from 'assets/icons/icon-menu-vertical.svg';
import { ReactComponent as Add } from 'assets/icons/icon-add.svg';
import AddItem from './views/add-items';
import AddHead from './views/add-head';

/* ----------------------- CompanyStructure PropTypes ----------------------- */
const propTypes = {
	getAllHeads: PropTypes.func,
	items: PropTypes.object,
	deactivateHeadOrItemById: PropTypes.func,
	isLoadingHead: PropTypes.bool,
	head: PropTypes.object,
};
const CompanyStructure = ({
	getAllHeads,
	items,
	deactivateHeadOrItemById,
	isLoadingHead,
	head,
}) => {
	const [showAddHead, setAddHead] = useState({
		show: false,
		edit: false,
		data: {},
	});
	const [showAddItem, setAddItem] = useState({
		show: false,
		edit: false,
		data: {},
	});

	const [searchStructure, setStructure] = useState('');
	const previousStructureRef = useRef('');

	useMount(() => {
		getAllHeads();
	});

	const searchStructures = debounce(async (value) => {
		if (previousStructureRef.current === value) {
			try {
				// await refetch();
			} finally {
				await Promise.all([getAllHeads(value)]);
			}
		}
	}, 500);

	return (
		<>
			<NavLayout title="Company Structure" />
			<DashboardSubWrapper className="wrapper-contain">
				<h4 className="page-main-title">Company Structure</h4>
				<div className="row">
					<div className="col-md-3">
						<div className="card main-table-wrapper">
							<div className="card-body">
								<p className="summary-title">No. of Heads</p>
								<h3 className="card-summary-value">{head?.count || 0}</h3>
							</div>
						</div>
					</div>
					<div className="col-md-3">
						<div className="card main-table-wrapper">
							<div className="card-body">
								<p className="summary-title">No. of Items</p>
								<h3 className="card-summary-value">{items?.count || 0}</h3>
							</div>
						</div>
					</div>
					<div className="col-md-1" />
					{/* <div className="col-md-6">
						<div className="card main-table-wrapper graph__card">
							{!isLoadingHead ? (
								<div className="row ">
									<div className="col-md-6">
										<div className="d-flex align-items-center justify-content-center">
											<div>
												<h4>Heads</h4>
												<Graph
													active={(
														(head?.total_head_active / head?.total_heads) *
														100
													).toFixed(0)}
													inactive={(
														(head?.total_head_inactive / head?.total_heads) *
														100
													).toFixed(0)}
												/>
											</div>
											<div className="graph__legend mt-3">
												<p className="green">
													<span />
													<b>
														{(
															(head?.total_head_active / head?.total_heads) *
															100
														).toFixed(0)}
														%{' '}
													</b>
													Active
												</p>
												<p className="red">
													<span />
													<b>
														{(
															(head?.total_head_inactive / head?.total_heads) *
															100
														).toFixed(0)}
														%
													</b>{' '}
													Inactive
												</p>
											</div>
										</div>
									</div>
									<div className="col-md-6">
										<div className="d-flex align-items-center justify-content-center">
											<div>
												<h4>Items</h4>
												<Graph
													active={(
														(head?.total_item_active / head?.total_items) *
														100
													).toFixed(0)}
													inactive={(
														(head?.total_item_inactive / head?.total_items) *
														100
													).toFixed(0)}
												/>
											</div>

											<div className="graph__legend mt-3">
												<p className="green">
													<span />
													<b>
														{(
															(head?.total_item_active / head?.total_items) *
															100
														).toFixed(0)}
														%
													</b>{' '}
													Active
												</p>
												<p className="red">
													<span />
													<b>
														{(
															(head?.total_item_inactive / head?.total_items) *
															100
														).toFixed(0)}
														%
													</b>{' '}
													Inactive
												</p>
											</div>
										</div>
									</div>
								</div>
							) : (
								<Loader loadingText={null} height="90px" />
							)}
						</div>
					</div> */}
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
								onChange={(e) => {
									setStructure(e.target.value);
									previousStructureRef.current = e.target.value;
									searchStructures(e.target.value);
								}}
								inputClassName="table-search-input"
							/>
							<div>
								<button
									type="button"
									className="btn btn-danger table-add-new"
									onClick={() =>
										setAddHead((prev) => {
											return { ...prev, show: true, edit: false };
										})
									}
									style={{ float: 'right' }}
								>
									<Add className="mr-2" /> Add Head
								</button>
								<button
									type="button"
									className="btn btn-danger table-add-new"
									onClick={() =>
										setAddItem((prev) => {
											return { ...prev, show: true, edit: false };
										})
									}
									style={{ marginRight: '20px' }}
								>
									<Add className="mr-2" /> Add Item
								</button>
							</div>
						</TableHead>

						<TableWrap>
							{' '}
							{!isLoadingHead ? (
								<Table responsive>
									<thead>
										<tr>
											<th>S/N</th>
											<th>Name</th>
											<th>No. of Items</th>
											<th>Description</th>
											<th>Company</th>
											<th>Status</th>
											<th className="text-right">Actions</th>
										</tr>
									</thead>
									<tbody>
										{head?.results?.map((heads, index) => (
											<tr>
												<td>{index + 1}</td>
												<td>
													<Link
														to={`/dashboard/company-structure/${heads?.id}`}
													>
														{heads.name}
													</Link>
												</td>
												<td>{heads.items_count}</td>
												<td className="w-25">
													{trunc(heads?.description, 70)}
												</td>
												<td>
													{heads?.company?.map((data) => data.name)?.join(', ')}
												</td>
												<td>
													<span
														className={`status-${
															heads?.is_active ? 'active' : 'inactive'
														}`}
													>
														{heads?.is_active ? 'Active' : 'Inactive'}
													</span>
												</td>
												<td className="text-right">
													<Dropdown>
														<Dropdown.Toggle as={More} />
														<Dropdown.Menu>
															<Dropdown.Item
																as={Link}
																to={`/dashboard/company-structure/${heads?.id}`}
															>
																View
															</Dropdown.Item>
															<Dropdown.Item
																href="#!"
																onClick={() =>
																	setAddHead((prev) => {
																		return {
																			...prev,
																			show: true,
																			edit: true,
																			data: heads,
																		};
																	})
																}
															>
																Edit
															</Dropdown.Item>
															{heads?.is_active && (
																<Dropdown.Item
																	href="#!"
																	className="red"
																	onClick={(e) => {
																		e.preventDefault();
																		deactivateHeadOrItemById(heads?.id, true);
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
								</Table>
							) : (
								<Loader loadingText="Getting Heads" />
							)}
							<Paginate
								total={head.total_pages}
								next={head.next}
								previous={head.previous}
								getData={getAllHeads}
								currentPage={head?.current_page}
								getNext={() => getAllHeads('', '', head?.next)}
								getPrevious={() => getAllHeads('', '', head?.previous)}
							/>
						</TableWrap>
					</TableWrap>
				</div>
			</DashboardSubWrapper>
			<AddHead
				show={showAddHead?.show}
				closeModal={() =>
					setAddHead((prev) => {
						return { ...prev, show: false, data: {} };
					})
				}
				data={showAddHead?.data}
				isEdit={showAddHead?.edit}
			/>
			<AddItem
				show={showAddItem?.show}
				closeModal={() =>
					setAddItem((prev) => {
						return { ...prev, show: false, data: {} };
					})
				}
				data={showAddItem?.data}
				isEdit={showAddItem?.edit}
			/>
		</>
	);
};
// const Graph = styled.div`
// 	width: 60px;
// 	height: 60px;

// 	background: ${(props) => ` radial-gradient(white 55%, transparent 41%),
//     conic-gradient(#279E3A 0% ${props?.active}%, #C54124 ${props?.active}% ${props?.inactive}%);`};
// 	margin-right: 1.1rem;
// 	display: inline-block;
// 	border-radius: 50%;
// `;
export const DashboardSubWrapper = styled.div`
	animation: fadeInUp;
	animation-duration: 0.5s;
	.card {
		background: #ffffff;
		border: 1px solid #eaebeb;
		box-sizing: border-box;
		border-radius: 8px;
		@media (max-width: 990px) {
			margin-bottom: 1rem;
		}
		.card-body {
			padding: 1.25rem 15px;

			p {
				font-style: normal;
				font-weight: normal;
				font-size: var(--font-p);
				line-height: 18px;
				letter-spacing: 0.02em;
				margin-bottom: 5px;
				/* Text/Grey */

				color: var(--text-gray);
			}
			h3 {
				font-style: normal;
				font-weight: bold;
				font-size: var(--font-h1);

				margin: 0;
				line-height: 45px;
				/* identical to box height */

				letter-spacing: -0.03em;

				/* Text/Black */

				color: var(--text-black);
			}
		}
	}
	.graph__card {
		padding: 9px 0;
		h4 {
			font-style: normal;
			font-weight: normal;
			font-size: var(--font-p);
			line-height: 18px;
			letter-spacing: 0.02em;
			margin-bottom: 5px;
			margin-left: 10px;
			/* Text/Grey */

			color: var(--text-black);
		}
		p {
			font-style: normal;
			font-weight: normal;
			font-size: var(--font-accent);
			line-height: 15px;
			/* identical to box height */

			letter-spacing: 0.03em;
			margin-bottom: 7px;
			/* Text/Grey */

			color: var(--text-gray);
			span {
				height: 6px;
				width: 6px;

				display: inline-block;
				border-radius: 50%;
				margin-right: 6px;
			}
			b {
				font-weight: normal;
			}
			&.green {
				span {
					background: #279e3a;
				}
				b {
					color: green;
				}
			}
			&.red {
				span {
					background: #c54124;
				}
				b {
					color: red;
				}
			}
			&.blue {
				font-size: var(--font-accent);
				span {
					background: #336ee4;
				}
				b {
					color: #336ee4;
				}
			}
		}
	}
`;
CompanyStructure.propTypes = propTypes;

const mapStateToProps = createStructuredSelector({
	isLoadingHead: selectisLoadingHead,
	head: selectAllHeads,
	isLoadingItems: selectisLoadingItem,
	items: selectAllItems,
});
export default connect(mapStateToProps, {
	getAllHeads,
	deactivateHeadOrItemById,
})(CompanyStructure);
