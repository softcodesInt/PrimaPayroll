/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React, { useState } from 'react';
import { Dropdown, OverlayTrigger, Popover, Table } from 'react-bootstrap';
import styled from 'styled-components';
import PropTypes from 'prop-types';
/* -------------------------- Internal Dependencies ------------------------- */
import NavLayout from 'components/layout/dashboard-layout/navbar';

/* --------------------------- Image Dependencies --------------------------- */
import { ReactComponent as More } from 'assets/icons/icon-menu-vertical.svg';
import { ReactComponent as Add } from 'assets/icons/icon-add.svg';
import { TableWrap, TableHead } from 'components/layout/dashboard-layout';
import AddHead from './add-head';
import AddItem from './add-items';
import { NavItem } from 'components/layout/dashboard-layout/navbar';
import { useMount } from 'broad-state';
import {
	getHeadById,
	deactivateHeadOrItemById,
} from 'redux/company-structure/actions';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
	selectCurrentHead,
	selectisLoadingHead,
} from 'redux/company-structure/selectors';
import Loader from 'components/loader';
import isEmpty from 'codewonders-helpers/bundle-cjs/helpers/is-empty';

/* --------------------------- ViewHead PropTypes --------------------------- */
const propTypes = {
	isLoading: PropTypes.bool,
	head: PropTypes.object,
};

const ViewHead = ({
	isLoading,
	head,
	getHeadById,
	deactivateHeadOrItemById,
}) => {
	const [showAddHead, setAddHead] = useState({ show: false, edit: false });
	const [showAddItem, setAddItem] = useState({ show: false, edit: false });
	const { id } = useParams();

	useMount(() => {
		getHeadById(id);
	});

	return (
		<>
			{!isLoading ? (
				<>
					<NavLayout title={head?.name} isBack={true}>
						<NavItem
							className="light-blue"
							onClick={() =>
								setAddHead((prev) => {
									return { ...prev, show: true, edit: true };
								})
							}
						>
							Edit
						</NavItem>
						{head?.is_active && (
							<OverlayTrigger
								trigger="click"
								key={'bottom'}
								rootClose
								placement={'bottom'}
								overlay={
									<Popover id={`popover-positioned-${'bottom'}`}>
										<div className="p-3 p-3_popover">
											<h4>Are you sure you want to deactivate this Head ?</h4>

											<button
												className="btn btn-primary-blue mt-3"
												onClick={() => deactivateHeadOrItemById(id, true, true)}
											>
												Yes, Continue
											</button>
										</div>
									</Popover>
								}
							>
								<NavItem className="light-red">Deactivate</NavItem>
							</OverlayTrigger>
						)}
					</NavLayout>
					<ViewHeadWrapper className="wrapper-contain">
						<SectionHeadsnItems>
							<TableWrap>
								<div className="table__wrap-header">
									<h4>Description</h4>
									<p>{head?.description}</p> <hr />
								</div>

								<TableHead className="mt-5">
									<div className="d-flex align-items-center">
										<h4>Items ({head?.items_count})</h4>
										<Dropdown className="sorter">
											<Dropdown.Toggle id="dropdown-basic">
												sort by
											</Dropdown.Toggle>

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
										className="btn btn-light-blue"
										onClick={() =>
											setAddItem((prev) => {
												return { ...prev, show: true, edit: false };
											})
										}
									>
										<Add className="mr-2" /> Add a new item
									</button>
								</TableHead>
								<Table responsive>
									<thead>
										<tr>
											<th>S/N</th>
											<th>Name</th>
											<th>Description</th>
											<th>Status</th>
											<th className="text-right">Actions</th>
										</tr>
									</thead>

									{!isLoading && !isEmpty(head?.items) ? (
										<>
											{' '}
											<tbody>
												{head?.items?.map((head_data, index) => (
													<tr>
														<td>{index + 1}</td>
														<td>
															<a href="#!">{head_data?.name}</a>
														</td>

														<td className="w-32">{head_data?.description}</td>
														<td>
															<span
																className={`status-${
																	head_data?.is_active ? 'active' : 'inactive'
																}`}
															>
																{head_data?.is_active ? 'Active' : 'Inactive'}
															</span>
														</td>
														<td className="text-right">
															<Dropdown>
																<Dropdown.Toggle as={More} />

																<Dropdown.Menu>
																	<Dropdown.Item
																		href="#!"
																		onClick={() =>
																			setAddItem((prev) => {
																				return {
																					...prev,
																					show: true,
																					edit: true,
																					data: head_data,
																				};
																			})
																		}
																	>
																		Edit
																	</Dropdown.Item>
																	<Dropdown.Item
																		href="#!"
																		className="red"
																		onClick={() =>
																			deactivateHeadOrItemById(
																				head_data?.id,
																				false
																			)
																		}
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
										<p className="text-center m-auto no-data">No Data Yet</p>
									)}
								</Table>
							</TableWrap>
						</SectionHeadsnItems>
					</ViewHeadWrapper>
					<AddHead
						show={showAddHead?.show}
						closeModal={() =>
							setAddHead((prev) => {
								return { ...prev, show: false };
							})
						}
						isEdit={showAddHead?.edit}
						data={head}
					/>
					<AddItem
						show={showAddItem?.show}
						closeModal={() =>
							setAddItem((prev) => {
								return { ...prev, show: false, data: {} };
							})
						}
						data={showAddItem.data}
						isEdit={showAddItem?.edit}
					/>
				</>
			) : (
				<Loader loadingText="Getting Head Information" />
			)}
		</>
	);
};

const ViewHeadWrapper = styled.div`
	/* margin-top: 3rem; */
	animation: fadeInUp;
	animation-duration: 0.5s;
`;

const SectionHeadsnItems = styled.div`
	margin-top: 4rem;
`;
ViewHead.propTypes = propTypes;
const mapStateToProps = createStructuredSelector({
	isLoading: selectisLoadingHead,
	head: selectCurrentHead,
});
export default connect(mapStateToProps, {
	getHeadById,
	deactivateHeadOrItemById,
})(ViewHead);
