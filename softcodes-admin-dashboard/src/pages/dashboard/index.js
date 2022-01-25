/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React from 'react';
import styled from 'styled-components';
import { Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
/* --------------------------- Internal Dependecie -------------------------- */
import { SubNavBar } from 'components/layout/dashboard-layout/navbar';
import Button from 'components/button';

/* --------------------------- Image Dependenceis --------------------------- */
import { ReactComponent as Companies } from 'assets/icons/icon-activity-company.svg';
import { ReactComponent as Staff } from 'assets/icons/icon-activity-staff.svg';
import { ReactComponent as EllipseRight } from 'assets/icons/icon-ellipse-right.svg';
import { ReactComponent as Add } from 'assets/icons/icon-add.svg';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
	selectAuthUser,
	selectDashboardActiviy,
	selectisLoading,
} from 'redux/user/selectors';
import {
	selectAllCurrentStaffs,
	selectCompanyLoading,
	selectCurrentCompanies,
	selectStaffLoading,
} from 'redux/accounts/selectors';
import isEmpty from 'codewonders-helpers/bundle-cjs/helpers/is-empty';
import { useMount } from 'broad-state';
import { getAuditLog } from 'redux/user/actions';
import { getCompanies, getStaffs } from 'redux/accounts/actions';
import Loader from 'components/loader';
import Avatar from 'components/avatar';
import { capitalize } from 'utils';
import { user_id } from 'utils/user_persist';
import history from 'utils/history';

/* ----------------------------- Companies propTypes ---------------------------- */
const propsTypes = {
	isLoading: PropTypes.bool,
	isCompany: PropTypes.bool,
	getAuditLog: PropTypes.func,
	getCompanies: PropTypes.func,
	getStaffs: PropTypes.func,
	activity: PropTypes.object,
	user: PropTypes.object,
	staffs: PropTypes.object,
	company: PropTypes.array,
};

const Dashboard = ({
	user,
	company,
	staffs,
	activity,
	getAuditLog,
	getCompanies,
	getStaffs,
	isStaff,
	isLoading,
	isCompany,
}) => {
	const isAdmin = !isEmpty(user) && user?.role === 'ADMIN';
	const isNotViewer = !isEmpty(user) && user?.role !== 'VIEWER';

	useMount(() => {
		getAuditLog();

		if (isEmpty(company)) {
			getCompanies();
		}
		if (isEmpty(staffs)) {
			getStaffs();
		}
	});
	return (
		<>
			<SubNavBar>
				<h3>Dashboard</h3>
				<div className="d-flex">
					{isNotViewer ? (
						<Link to="/dashboard/staff/create">
							<Button className="btn btn-light-blue mr-3" icon={<Add />}>
								Add a new staff
							</Button>
						</Link>
					) : null}
					{isAdmin ? (
						<Link to="/dashboard/companies/create">
							<Button className="btn-soft sm-size" icon={<Add />}>
								Add a new company
							</Button>
						</Link>
					) : null}
				</div>
			</SubNavBar>
			<DashboardWrapper>
				<DashboardHeader>
					<div className="row">
						<div className="col-md-11 mr-auto">
							<div className="row">
								<div className="col-md-3">
									<div className="card green">
										<div className="card-body">
											<p>Number of companies</p>
											<h2>{company?.count || '...'}</h2>
										</div>
									</div>
								</div>
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
				<DashboardActivities>
					<div className="row">
						<div className="col-md-8">
							<div className="card">
								<div className="card-body">
									<div className="tile-header d-flex align-items-center">
										<h4>Activity</h4>
										<select
											className="custom-select"
											onChange={(e) => {
												if (e.target?.value === 'company') {
													history.push('/dashboard/companies');
												}
												if (e.target?.value === 'staff') {
													history.push('/dashboard/staff');
												}
											}}
										>
											<option>Filter by</option>
											<option value="company">Filter by Company</option>
											<option value="staff">Filter by Staff</option>
										</select>
									</div>

									{!isLoading ? (
										<>
											{activity?.activity?.map((act) => (
												<div className="activity__today">
													<h4 className="tile-text-accent">{act?.heading}</h4>
													{act?.data?.map((activity_tile) => (
														<div className="activity__today-tile">
															{!isEmpty(activity_tile?.company) ? (
																<Companies />
															) : (
																<Staff />
															)}
															<h4>
																{activity_tile?.blamer?.id === user_id ? (
																	<b>You </b>
																) : (
																	<b>
																		{activity_tile?.blamer?.first_name}{' '}
																		{activity_tile?.blamer?.last_name}{' '}
																	</b>
																)}
																{capitalize(activity_tile?.action) + 'd'}{' '}
																{activity_tile?.action === 'CREATE' &&
																	`a new ${
																		activity_tile?.company ? 'company' : 'staff'
																	}`}
																<Link
																	to={
																		activity_tile?.company
																			? `/dashboard/company/${activity_tile?.company?.id}`
																			: `/dashboard/staffs/${activity_tile?.staff?.id}`
																	}
																>
																	{' '}
																	{activity_tile?.company?.name ||
																		`${activity_tile?.staff?.first_name} ${activity_tile?.staff?.last_name}`}{' '}
																</Link>
																<span className="activity__today-tile-time">
																	{moment(
																		new Date(activity_tile?.timestamp)
																	).fromNow()}
																</span>
															</h4>
														</div>
													))}
												</div>
											))}
										</>
									) : (
										<Loader loadingText="Getting Activities" />
									)}
									<div className="activity__paginate">
										<Pagination className="m-auto">
											<Pagination.Prev
												onClick={() => getAuditLog(activity?.previous)}
												disabled={!activity?.previous}
											/>

											<Pagination.Next
												onClick={() => getAuditLog(activity?.next)}
												disabled={!activity?.next}
											/>
										</Pagination>
									</div>
								</div>
							</div>
						</div>
						<div className="col-md-4">
							<div className="card mb-4">
								<div className="card-body">
									<div className="tile-header variation-2">
										<h4>Companies</h4>
									</div>
									{!isCompany ? (
										<>
											{!isEmpty(company?.results) ? (
												<>
													{company?.results?.slice(0, 4)?.map((cmp) => (
														<div className="companies-tile">
															<div className="companies-tile-details d-flex align-items-center">
																<Avatar data={cmp?.name} isTile />
																<h4>{cmp?.name}</h4>
															</div>

															<Link to={`/dashboard/company/${cmp?.id}`}>
																<EllipseRight />
															</Link>
														</div>
													))}
												</>
											) : (
												<div className="company__list-slate text-center">
													<h4>No Companies yet</h4>
												</div>
											)}
										</>
									) : (
										<Loader loadingText="Getting Companies" />
									)}
									{company?.count > 4 && (
										<Link
											to="/dashboard/companies"
											className="btn btn-light-blue companies-tile-action"
										>
											View All
										</Link>
									)}
								</div>
							</div>
							<div className="card mb-4">
								<div className="card-body">
									<div className="tile-header variation-2">
										<h4>Staff</h4>
									</div>
									{!isStaff ? (
										<>
											{!isEmpty(staffs?.results) ? (
												<>
													{staffs?.results?.slice(0, 4)?.map((staff) => (
														<div className="companies-tile staff-tile">
															<div className="companies-tile-details d-flex align-items-center">
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
																<h4>
																	{' '}
																	{staff?.first_name} {staff?.last_name}
																</h4>
															</div>

															<Link to={`/dashboard/staffs/${staff?.id}`}>
																<EllipseRight />
															</Link>
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
									{staffs?.count > 4 && (
										<Link
											to="/dashboard/staff"
											className="btn btn-light-blue companies-tile-action"
										>
											View All
										</Link>
									)}
								</div>
							</div>
						</div>
					</div>
				</DashboardActivities>
			</DashboardWrapper>
		</>
	);
};
export const DashboardWrapper = styled.section`
	padding: 2rem 2.85rem;
`;

export const DashboardHeader = styled.div`
	.card {
		background: #ffffff;
		border-radius: 8px;
		border: none;
		&.green {
			border-top: 6px solid #30be7a !important;
		}
		&.purple {
			border-top: 6px solid #5b69e8 !important;
		}
		&.orange {
			border-top: 6px solid #e86840 !important;
		}
		&-body {
			text-align: right;
			padding: 15px 25px;
			h2 {
				font-weight: bold;
				font-size: var(--font-h1);
				line-height: 45px;
				/* identical to box height */

				letter-spacing: -0.03em;

				/* Text/Black */
				margin: 0;
				color: var(--text-black);
				small {
					font-size: 21px;
				}
			}
			p {
				font-style: normal;
				font-weight: normal;
				font-size: var(--font-p);
				line-height: 18px;
				letter-spacing: 0.02em;

				/* Text/Grey */
				margin-bottom: 2px;
				color: var(--text-gray);
			}
		}
	}
`;

export const DashboardActivities = styled.section`
	margin-top: 2rem;
	.card {
		background: #ffffff;
		border-radius: 8px;
		border: none;

		&-body {
			padding: 1.8rem;
		}
	}
	.tile-header {
		margin-bottom: 2.7rem;
		h4 {
			font-style: normal;
			font-weight: 500;
			font-size: var(--font-h4);
			line-height: 23px;
			/* identical to box height */

			letter-spacing: -0.015em;

			/* Text/Black */

			color: var(--text-black);
		}
		select {
			background: #fbfbfb;
			/* Grey */

			border: 1px solid #8c939a;
			box-sizing: border-box;
			border-radius: 4px;
			font-weight: normal;
			font-size: 14px;
			line-height: 18px;
			letter-spacing: 0.02em;

			/* Text/Grey */

			color: #4c4e51;
			width: 120px;
			margin-left: 1rem;
		}
		&.variation-2 {
			margin-bottom: 1.5rem;
		}
	}

	.activity__today {
		.tile-text-accent {
			font-style: normal;
			font-weight: normal;
			font-size: var(--font-accent);
			line-height: 15px;
			/* identical to box height */
			margin-top: 2.5rem;
			letter-spacing: 0.03em;

			/* Text/Black */
			text-transform: uppercase;
			color: var(--text-black);
		}
		&-tile {
			display: flex;
			align-items: center;
			margin-bottom: 1.3rem;
			svg {
				margin-right: 1rem;
			}
			img {
				margin-right: 1rem;
				height: 40px;
				width: 40px;
				object-fit: cover;
			}
			h4 {
				font-weight: 400;
				font-size: var(--font-p);
				line-height: 18px;
				letter-spacing: 0.02em;
				margin-bottom: 0;

				/* Text/Black */

				color: var(--text-gray);
				b {
					color: var(--text-black);
					font-weight: 600;
				}
			}
			a {
				color: var(--primary-blue);
			}
			&-time {
				margin-left: 1rem;
				color: var(--gray);
			}
		}
	}
	.activity__paginate {
		margin-top: 2.7rem;
		display: flex;
		.page-link {
			color: var(--gray);
			border: 0px solid #dee2e6 !important;
			font-size: 29px;
			padding: 0 30px;
		}
		.page-item.active .page-link {
			color: var(--text-black) !important;
			background-color: transparent !important;
		}
		.page-item {
			&.disabled {
				opacity: 0.4;
				cursor: no-drop;
			}
		}
		.pagination {
			/* transform: translate(-65px, -1px); */
		}
		.pagination__input {
			p {
				font-size: 14px;
				color: var(--text-gray);
				margin: 0;
			}
			input {
				width: 35px;
				/* background: red; */
				background: #f8f8f9;
				border-radius: 4px;
				border: none;
				padding: 8px;
				font-size: 14px;
				text-align: center;
			}
		}
	}

	.companies-tile {
		margin-bottom: 1.3rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		a {
			color: var(--primary-blue);
		}
		h4 {
			font-style: normal;
			font-weight: 500;
			font-size: var(--font-p);
			line-height: 1.5;
			letter-spacing: 0.02em;

			/* Text/Black */
			margin: 0;

			color: var(--text-black);
		}
		&-action {
			display: block;
			width: fit-content;
			margin: 1.3rem auto 0;
		}
		img {
			height: 40px;
			width: 40px;
			object-fit: cover;
			border-radius: 10px;
		}
		&.staff-tile {
			img {
				border-radius: 50%;
			}
		}
	}
`;

Dashboard.propsTypes = propsTypes;
const mapStateToProps = createStructuredSelector({
	isLoading: selectisLoading,
	activity: selectDashboardActiviy,
	user: selectAuthUser,
	staffs: selectAllCurrentStaffs,
	isStaff: selectStaffLoading,
	company: selectCurrentCompanies,
	isCompany: selectCompanyLoading,
});
export default connect(mapStateToProps, {
	getStaffs,
	getCompanies,
	getAuditLog,
})(Dashboard);
