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
import AddLeave from './add-leave';
import AddCategory from './add-category';
import { NavItem } from 'components/layout/dashboard-layout/navbar';
import { useMount } from 'broad-state';

import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Loader from 'components/loader';
import isEmpty from 'codewonders-helpers/bundle-cjs/helpers/is-empty';
import {
	getLeaveById,
	deactivateLeave,
	deactivateCategory,
} from 'redux/leave/actions';
import { selectCurrentLeave, selectisLoading } from 'redux/leave/selectors';

/* --------------------------- ViewHead PropTypes --------------------------- */
const propTypes = {
	isLoading: PropTypes.bool,
	leave: PropTypes.object,
};

const ViewHead = ({
	isLoading,
	leave,
	getLeaveById,
	deactivateLeave,
	deactivateCategory,
}) => {
	const [showAddLeave, setAddLeave] = useState({ show: false, edit: false });
	const [showAddCategory, setAddCategory] = useState({
		show: false,
		edit: false,
	});
	const { id: pageId } = useParams();

	useMount(() => {
		getLeaveById(pageId);
	});

	return (
		<>
			{!isLoading ? (
				<>
					<NavLayout title={leave?.name} isBack={true}>
						<NavItem
							className="light-blue"
							onClick={() =>
								setAddCategory((prev) => {
									return { ...prev, show: true, edit: true, data: leave };
								})
							}
						>
							Edit
						</NavItem>
						{leave?.is_active && (
							<OverlayTrigger
								trigger="click"
								key={'bottom'}
								rootClose
								placement={'bottom'}
								overlay={
									<Popover id={`popover-positioned-${'bottom'}`}>
										<div className="p-3 p-3_popover">
											<h4>Are you sure you want to deactivate this Leave ?</h4>

											<button
												className="btn btn-primary-blue mt-3"
												onClick={() => deactivateCategory(pageId, true)}
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
									<p>{leave?.description}</p> <hr />
								</div>

								<TableHead className="mt-5">
									<div className="d-flex align-items-center">
										<h4>Leaves ({leave?.leave_count})</h4>
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
											setAddLeave((prev) => {
												return { ...prev, show: true, edit: false };
											})
										}
									>
										<Add className="mr-2" /> Add a new leave
									</button>
								</TableHead>
								<Table responsive>
									<thead>
										<tr>
											<th>S/N</th>
											<th>Name</th>

											<th>Description</th>
											<th className="w-15">Entitlement Value</th>
											<th className="w-15">Weekend Apply</th>
											<th className="w-15">Months Prior</th>
											<th className="w-15">Gender</th>
											<th className="w-15">Is Sick Leave</th>
											<th>Status</th>
											<th className="text-right">Actions</th>
										</tr>
									</thead>

									{!isLoading && !isEmpty(leave?.leaves) ? (
										<>
											{' '}
											<tbody>
												{leave?.leaves?.map((leave_data, index) => (
													<tr>
														<td>{index + 1}</td>
														<td>
															<a href="#!">{leave_data?.name}</a>
														</td>

														<td className="w-32">{leave_data?.description}</td>
														<td>{leave_data?.entitlement_value}</td>
														<td>{leave_data?.weekend_apply ? 'Yes' : 'No'}</td>
														<td>{leave_data?.months_prior}</td>
														<td>
															{leave_data?.for_female && 'Female'}{' '}
															{leave_data?.for_female && leave_data?.for_male
																? 'and'
																: ''}{' '}
															{leave_data?.for_male && 'Male'}
														</td>
														<td>{leave_data?.is_sick_leave ? 'Yes' : 'No'}</td>
														<td>
															<span
																className={`status-${
																	leave_data?.is_active ? 'active' : 'inactive'
																}`}
															>
																{leave_data?.is_active ? 'Active' : 'Inactive'}
															</span>
														</td>
														<td className="text-right">
															<Dropdown>
																<Dropdown.Toggle as={More} />

																<Dropdown.Menu>
																	<Dropdown.Item
																		onClick={() =>
																			setAddLeave((prev) => {
																				return {
																					...prev,
																					show: true,
																					edit: true,
																					data: leave_data,
																				};
																			})
																		}
																	>
																		Edit
																	</Dropdown.Item>
																	{leave_data?.is_active && (
																		<Dropdown.Item
																			className="red"
																			onClick={() =>
																				deactivateLeave(leave_data?.id, false)
																			}
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
										<p className="text-center m-auto no-data">No Data Yet</p>
									)}
								</Table>
							</TableWrap>
						</SectionHeadsnItems>
					</ViewHeadWrapper>
					<AddLeave
						show={showAddLeave?.show}
						closeModal={async () => {
							await setAddLeave((prev) => {
								return { ...prev, show: false, data: {} };
							});
						}}
						data={showAddLeave.data}
						isEdit={showAddLeave?.edit}
					/>
					<AddCategory
						show={showAddCategory?.show}
						closeModal={() =>
							setAddCategory((prev) => {
								return { ...prev, show: false, data: {} };
							})
						}
						data={showAddCategory?.data}
						isEdit={showAddCategory?.edit}
					/>
				</>
			) : (
				<Loader loadingText="Getting Leave Information" />
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
	isLoading: selectisLoading,
	leave: selectCurrentLeave,
});
export default connect(mapStateToProps, {
	getLeaveById,
	deactivateLeave,
	deactivateCategory,
})(ViewHead);
