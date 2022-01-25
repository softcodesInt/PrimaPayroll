/* eslint-disable no-shadow */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Table } from 'react-bootstrap';

import NavLayout from 'components/layout/dashboard-layout/navbar';
import { ReactComponent as More } from 'assets/icons/icon-menu-vertical.svg';
import { ReactComponent as Add } from 'assets/icons/icon-add.svg';
import { TableWrap, TableHead } from 'components/layout/dashboard-layout';
import { useMount } from 'broad-state';
import { getAdminUsers, deactivateAdminUser } from 'redux/user/actions';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectAdminUsers, selectisLoading } from 'redux/user/selectors';
import { isEmpty } from 'codewonders-helpers';
import Loader from 'components/loader';
import AddAdminUser from './add';
import { DashboardSubWrapper } from '../company-structure';

const propTypes = {
	isLoading: PropTypes.bool,
	getAdminUsers: PropTypes.func,
	deactivateAdminUser: PropTypes.func,
	users: PropTypes.shape,
};

const UserAccess = ({
	isLoading,
	getAdminUsers,
	deactivateAdminUser,
	users,
}) => {
	const [showAddAdminUser, setAddAdminUser] = useState({
		show: false,
		edit: false,
		data: {},
	});
	useMount(() => {
		getAdminUsers();
	});

	return (
		<>
			<NavLayout title="Admin Users List" />
			<DashboardSubWrapper className="wrapper-contain">
				<h4 className="page-main-title">Admin Users</h4>
				<div className="row">
					<div className="col-md-3">
						<div className="card main-table-wrapper">
							<div className="card-body">
								<p className="summary-title">No. of Admin Users</p>
								<h3 className="card-summary-value">{users?.count || '...'}</h3>
							</div>
						</div>
					</div>
					<div className="col-md-1" />
					<div className="col-md-6" />
				</div>
				<div className="main-table-wrapper mt-5">
					<TableWrap>
						<TableHead>
							<div />
							<button
								type="button"
								className="btn btn-danger table-add-new"
								onClick={() =>
									setAddAdminUser((prev) => {
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
									{!isLoading && !isEmpty(users?.results) ? (
										<>
											{' '}
											<thead>
												<tr>
													<th>S/N</th>
													<th>First Name</th>
													<th>Last Name</th>
													<th>Super Admin</th>
													<th>Status</th>
													<th className="text-right">Actions</th>
												</tr>
											</thead>
											<tbody>
												{users?.results?.map((user, index) => (
													<tr>
														<td>{index + 1}</td>
														<td>{user.user.first_name}</td>
														<td>{user.user.last_name}</td>
														<td>
															{user.has_all_access ? 'Admin' : 'Company Level'}
														</td>
														<td>
															<span
																className={`status-${
																	user?.user.is_active ? 'active' : 'inactive'
																}`}
															>
																{user?.user.is_active ? 'Active' : 'Inactive'}
															</span>
														</td>
														<td className="text-right">
															<Dropdown>
																<Dropdown.Toggle as={More} />
																<Dropdown.Menu>
																	<Dropdown.Item
																		href="#!"
																		onClick={() =>
																			setAddAdminUser((prev) => {
																				return {
																					...prev,
																					show: true,
																					edit: true,
																					data: {
																						first_name: user.user.first_name,
																						last_name: user.user.last_name,
																						email: user.user.email,
																						has_all_access: user.has_all_access,
																						id: user.id,
																					},
																				};
																			})
																		}
																	>
																		Edit
																	</Dropdown.Item>
																	{user?.user.is_active && (
																		<Dropdown.Item
																			href="#!"
																			className="red"
																			onClick={(e) => {
																				e.preventDefault();
																				deactivateAdminUser(user.id);
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
										<p className="text-center mx-auto  mt-5 no-data">
											No Admin Users Yet
										</p>
									)}
								</Table>
							) : (
								<Loader loadingText="Getting Admin Users" />
							)}
						</TableWrap>
					</TableWrap>
				</div>
			</DashboardSubWrapper>

			<AddAdminUser
				show={showAddAdminUser?.show}
				closeModal={() =>
					setAddAdminUser((prev) => {
						return { ...prev, show: false, data: {} };
					})
				}
				data={showAddAdminUser?.data}
				isEdit={showAddAdminUser?.edit}
			/>
		</>
	);
};

UserAccess.propTypes = propTypes;

const mapStateToProps = createStructuredSelector({
	isLoading: selectisLoading,
	users: selectAdminUsers,
});

export default connect(mapStateToProps, { getAdminUsers, deactivateAdminUser })(
	UserAccess
);
