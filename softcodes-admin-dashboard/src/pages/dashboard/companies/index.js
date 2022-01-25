/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
/* -------------------------- Internal Dependencies ------------------------- */
import { SubNavBar } from 'components/layout/dashboard-layout/navbar';
import Input from 'components/input';
import { useMount } from 'broad-state';
import isEmpty from 'codewonders-helpers/bundle-cjs/helpers/is-empty';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import { createStructuredSelector } from 'reselect';

/* --------------------------- Image Depenedencies -------------------------- */
import { ReactComponent as Add } from 'assets/icons/icon-add.svg';
import Search from 'assets/icons/icon-search.svg';
import { DashboardWrapper, DashboardHeader, DashboardActivities } from '..';
import { capitalize } from 'utils';

import Loader from 'components/loader';
import Avatar from 'components/avatar';
import {
	getCompanies,
	getCompaniesAudit,
	filterCompanies,
} from 'redux/accounts/actions';
import {
	selectAccountsLoading,
	selectCompanyAudit,
	selectCompanyLoading,
	selectCurrentCompanies,
} from 'redux/accounts/selectors';
import { user_id } from 'utils/user_persist';
import { Pagination } from 'react-bootstrap';
import { selectAuthUser } from 'redux/user/selectors';

/* ----------------------------- Companies propTypes ---------------------------- */
const propsTypes = {
	isLoading: PropTypes.bool,
	isCompany: PropTypes.bool,
	getUserById: PropTypes.func,
	getCompanies: PropTypes.func,
	activity: PropTypes.object,
	user: PropTypes.object,
	filterCompanies: PropTypes.func,
	company: PropTypes.array,
};

const Companies = ({
	activity,
	company,
	user,
	isCompany,
	isLoading,
	filterCompanies,
	getCompaniesAudit,
	getCompanies,
}) => {
	const isAdmin = !isEmpty(user) && user?.role === 'ADMIN';
	useMount(() => {
		if (isEmpty(activity?.results)) {
			getCompaniesAudit();
		}
		if (isEmpty(company)) {
			getCompanies();
		}
	});
	const [searchTerm, setSearchTerm] = useState('');
	const previousSearchTermRef = useRef('');

	const searchCompany = debounce(async (value) => {
		if (previousSearchTermRef.current === value) {
			try {
				// await refetch();
			} finally {
				await getCompanies({ searchQuery: value });
			}
		}
	}, 500);

	return (
		<>
			<SubNavBar>
				<h3>Companies</h3>
				<div className="d-flex"></div>
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
											<h4>List of companies</h4>
											<select
												className="custom-select"
												onChange={(e) => {
													if (e.target.value) {
														return filterCompanies(e.target.value);
													}
													return getCompanies();
												}}
											>
												<option value="">Filter by all</option>
												<option value="inactive">Filter by inactive</option>
												<option value="active">Filter by active</option>
												<option value="expired">Filter by expired</option>
											</select>
										</span>

										{isAdmin ? (
											<Link
												className="btn btn-primary-blue"
												to="/dashboard/companies/create"
											>
												<Add /> Add a new company
											</Link>
										) : null}
									</div>
									<Input
										placeholder="Search for companies"
										label=""
										icon={Search}
										value={searchTerm}
										onChange={(e) => {
											setSearchTerm(e.target.value);
											previousSearchTermRef.current = e.target.value;
											searchCompany(e.target.value);
										}}
									/>
									{!isCompany ? (
										<>
											{!isEmpty(company?.results) ? (
												<>
													{company?.results?.map((cmp) => (
														<div className="company__list-slate">
															<div className="media">
																<Avatar data={cmp?.name} isTile />
																<div className="d-flex media-body justify-content-between align-items-center">
																	<div>
																		<h4>{cmp?.name}</h4>
																		<p>
																			Subscription:{' '}
																			<strong>
																				{cmp?.subscription_year || 0} years{' '}
																				{(cmp?.subscription_month &&
																					cmp?.subscription_month +
																						' Months') ||
																					null}
																			</strong>{' '}
																			{cmp?.license?.expiration_date && (
																				<>
																					| Expires:{' '}
																					<strong>
																						{moment(
																							cmp?.license?.expiration_date
																						).format('Do MMM, YYYY')}
																					</strong>
																				</>
																			)}
																		</p>
																	</div>
																	<Link
																		to={`/dashboard/company/${cmp?.id}`}
																		className="btn btn-light-blue"
																	>
																		View
																	</Link>
																</div>
															</div>
														</div>
													))}
													<div className="activity__paginate mt-2 mb-0">
														<Pagination className="m-auto">
															<Pagination.Prev
																onClick={() =>
																	getCompanies({ url: company?.previous })
																}
																disabled={!company?.previous}
															/>

															<Pagination.Next
																onClick={() =>
																	getCompanies({ url: company?.next })
																}
																disabled={!company?.next}
															/>
														</Pagination>
													</div>
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
																<Avatar data={act?.company?.name} isTile />
																<h4>
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
																	<Link
																		to={`/dashboard/company/${act?.company?.id}`}
																	>
																		{act?.company?.name}
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
															<Pagination.Prev
																onClick={() =>
																	getCompaniesAudit(activity?.previous)
																}
																disabled={!activity?.previous}
															/>

															<Pagination.Next
																onClick={() =>
																	getCompaniesAudit(activity?.next)
																}
																disabled={!activity?.next}
															/>
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
export const DashboardList = styled(DashboardActivities)`
	.companies-tile {
		h4 {
			font-weight: 400;

			flex: 70%;

			a {
				color: var(--primary-blue);
			}
		}
		span.time {
			font-size: var(--font-accent);
			color: var(--text-gray);
			display: block;
			margin-left: 1rem;
		}
		span.avatar {
			width: 43px !important;
			height: 43px !important;
			font-size: 13px !important;

			flex: 0 43px;
		}
	}
	.company__list-slate {
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
		padding: 18px 0px;
		&:last-child {
			border: none;
		}
		img {
			height: 40px;
			width: 40px;
			object-fit: cover;
			border-radius: 10px;
		}
		h4 {
			font-style: normal;
			font-weight: normal;
			font-size: var(--font-p);
			line-height: 18px;
			letter-spacing: 0.02em;

			/* Text/Black */
			margin-bottom: 5px;
			color: var(--text-black);
		}
		.btn-light-blue {
			font-weight: 500;
		}
		p {
			font-style: normal;
			font-weight: normal;
			font-size: var(--font-accent);
			line-height: 15px;
			/* identical to box height */

			letter-spacing: 0.03em;

			/* Text/Black */
			margin-bottom: 0;
			color: var(--text-gray);
			strong {
				font-weight: 500;
				color: var(--text-black);
			}
		}
	}
`;

Companies.propsTypes = propsTypes;
const mapStateToProps = createStructuredSelector({
	isLoading: selectAccountsLoading,
	activity: selectCompanyAudit,
	user: selectAuthUser,
	company: selectCurrentCompanies,
	isCompany: selectCompanyLoading,
});
export default connect(mapStateToProps, {
	getCompanies,
	getCompaniesAudit,
	filterCompanies,
})(Companies);
