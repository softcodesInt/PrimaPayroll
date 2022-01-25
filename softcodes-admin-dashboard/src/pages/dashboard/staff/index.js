/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import moment from 'moment';
/* --------------------------- Image Dependencies --------------------------- */
import { ReactComponent as Add } from 'assets/icons/icon-add.svg';
import Search from 'assets/icons/icon-search.svg';

/* -------------------------- Internal Dependencies ------------------------- */
import { SubNavBar } from 'components/layout/dashboard-layout/navbar';
import Input from 'components/input';
import { DashboardWrapper, DashboardHeader } from '..';
import { DashboardList } from '../companies';
import { useMount } from 'broad-state';
import isEmpty from 'codewonders-helpers/bundle-cjs/helpers/is-empty';

import { getStaffAudit, getStaffs } from 'redux/accounts/actions';
import { connect } from 'react-redux';
import {
	selectAccountsLoading,
	selectAllCurrentStaffs,
	selectStaffAudit,
	selectStaffLoading,
} from 'redux/accounts/selectors';

import { createStructuredSelector } from 'reselect';
import { user_id } from 'utils/user_persist';
import { capitalize } from 'utils';
import Avatar from 'components/avatar';
import Loader from 'components/loader';
import { Pagination } from 'react-bootstrap';
import { selectAuthUser } from 'redux/user/selectors';

/* ----------------------------- Companies propTypes ---------------------------- */
const propsTypes = {
	isLoading: PropTypes.bool,
	isStaff: PropTypes.bool,
	getStaffAudit: PropTypes.func,
	getCompanies: PropTypes.func,
	activity: PropTypes.object,
	staffs: PropTypes.array,
};
const Staff = ({
	activity,
	staffs,
	user,
	isStaff,
	isLoading,
	getStaffAudit,
	getStaffs,
}) => {
	useMount(() => {
		if (isEmpty(activity?.results)) {
			getStaffAudit();
		}
		if (isEmpty(staffs)) {
			getStaffs();
		}
	});
	const isNotViewer = !isEmpty(user) && user?.role !== 'VIEWER';
	const [searchTerm, setSearchTerm] = useState('');
	const previousSearchTermRef = useRef('');

	const searchStaff = debounce(async (value) => {
		if (previousSearchTermRef.current === value) {
			try {
				// await refetch();
			} finally {
				await getStaffs({ searchQuery: value });
			}
		}
	}, 500);
	return (
		<>
			<SubNavBar>
				<h3>Staff</h3>
			</SubNavBar>
			<DashboardWrapper>
				<DashboardHeader>
					<div className="row">
						<div className="col-md-11 mr-auto">
							<div className="row">
								<div className="col-md-3">
									<div className="card purple">
										<div className="card-body">
											<p>Number of staff</p>
											<h2>{staffs?.count || '...'}</h2>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</DashboardHeader>
				<DashboardList>
					<div className="row">
						<div className="col-md-8">
							<div className="card">
								<div className="card-body">
									<div className="tile-header d-flex align-items-center justify-content-between">
										<span className="d-flex align-items-center">
											<h4>List of staff</h4>
											{/* <select className="custom-select">
												<option>Filter by</option>
												<option>Filter by</option>
												<option>Filter by</option>
												<option>Filter by</option>
											</select> */}
										</span>
										{isNotViewer ? (
											<Link
												className="btn btn-primary-blue"
												to="/dashboard/staff/create"
											>
												<Add /> Add a new staff
											</Link>
										) : null}
									</div>
									<Input
										placeholder="Search for staff"
										label=""
										icon={Search}
										value={searchTerm}
										onChange={(e) => {
											setSearchTerm(e.target.value);
											previousSearchTermRef.current = e.target.value;
											searchStaff(e.target.value);
										}}
									/>
									{!isStaff ? (
										<>
											{!isEmpty(staffs?.results) ? (
												<>
													{staffs?.results?.map((staff) => (
														<div className="company__list-slate">
															<div className="media">
																{staff?.profile_picture ? (
																	<img
																		src={staff?.profile_picture}
																		alt="Barter"
																		className="mr-3 rounded-circle"
																	/>
																) : (
																	<Avatar
																		data={{
																			first_name: staff?.first_name,
																			last_name: staff?.last_name,
																		}}
																		size="3.2em"
																		className="mr-3"
																	/>
																)}
																<div className="d-flex media-body justify-content-between align-items-center">
																	<div>
																		<h4>
																			{staff?.first_name} {staff?.last_name}
																		</h4>
																		<p>
																			Role:{' '}
																			<strong>{capitalize(staff?.role)}</strong>
																		</p>
																	</div>
																	<Link
																		to={`/dashboard/staffs/${staff?.id}`}
																		className="btn btn-light-blue"
																	>
																		View
																	</Link>
																</div>
															</div>
														</div>
													))}
												</>
											) : (
												<div className="company__list-slate text-center">
													<h4>No Staffs yet</h4>
												</div>
											)}
										</>
									) : (
										<Loader loadingText="Getting Staffs" />
									)}
									<div className="activity__paginate mt-2 mb-0">
										<Pagination className="m-auto">
											{staffs?.previous && (
												<Pagination.Prev
													onClick={() => getStaffs({ url: staffs?.previous })}
												/>
											)}
											{staffs?.next && (
												<Pagination.Next
													onClick={() => getStaffs({ url: staffs?.next })}
												/>
											)}
										</Pagination>
									</div>
								</div>
							</div>
						</div>
						<div className="col-md-4">
							<div className="card h-100 mb-4">
								<div className="card-body">
									<div className="tile-header variation-2">
										<h4>Recent Activity</h4>
									</div>
									{!isLoading ? (
										<>
											{!isEmpty(activity?.results) ? (
												<>
													{activity?.results?.map((act) => (
														<div className="companies-tile">
															<div className="companies-tile-details d-flex align-items-center">
																{act?.staff?.profile_picture ? (
																	<img
																		src={act?.staff?.profile_picture}
																		alt="Profile"
																		className="mr-3 rounded-circle"
																	/>
																) : (
																	<Avatar
																		data={{
																			first_name: act?.staff?.first_name,
																			last_name: act?.staff?.last_name,
																		}}
																		size="2.9em"
																		className="mr-0 avatar"
																	/>
																)}

																<h4
																	className={
																		!act?.staff?.profile_picture && 'ml-3'
																	}
																>
																	<>
																		{act?.blamer?.id !== user_id ? (
																			<strong>
																				{act?.blamer?.first_name}{' '}
																				{act?.blamer?.last_name}
																			</strong>
																		) : (
																			<strong>You</strong>
																		)}
																	</>{' '}
																	{capitalize(act?.action) + 'd'}{' '}
																	{act?.action === 'CREAT' &&
																		`a new ${capitalize(act?.meta?.role) ||
																			'new'}`}
																	<Link
																		to={`/dashboard/staffs/${act?.staff.id}`}
																	>
																		{act?.staff?.first_name}{' '}
																		{act?.staff?.last_name}
																	</Link>{' '}
																</h4>
															</div>

															<span className="time">
																{moment(new Date(act?.timestamp))
																	.fromNow()
																	.replace(' hours ago', 'h')
																	.replace(' days ago', 'd')
																	.replace(' minutes ago', 'm')
																	.replace('minute', 'min')
																	.replace('an hour ago', '1h')
																	.replace('a day ago', '1d')}
															</span>
														</div>
													))}
													<div className="activity__paginate mt-2 mb-0">
														<Pagination className="m-auto">
															{activity?.previous && (
																<Pagination.Prev
																	onClick={() =>
																		getStaffAudit(activity?.previous)
																	}
																/>
															)}
															{activity?.next && (
																<Pagination.Next
																	onClick={() => getStaffAudit(activity?.next)}
																/>
															)}
														</Pagination>
													</div>
												</>
											) : (
												<div className="companies-tile text-center">
													<h4>No Activities yet</h4>
												</div>
											)}
										</>
									) : (
										<Loader loadingText="Getting Activities" />
									)}
								</div>
							</div>
						</div>
					</div>
				</DashboardList>
			</DashboardWrapper>
		</>
	);
};

Staff.propsTypes = propsTypes;
const mapStateToProps = createStructuredSelector({
	isLoading: selectAccountsLoading,
	activity: selectStaffAudit,
	staffs: selectAllCurrentStaffs,
	user: selectAuthUser,
	isStaff: selectStaffLoading,
});
export default connect(mapStateToProps, { getStaffs, getStaffAudit })(Staff);
