/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
/* -------------------------- Internal Dependencies ------------------------- */
import Button from 'components/button';
import { SubNavBar } from 'components/layout/dashboard-layout/navbar';
import { DashboardWrapper, DashboardHeader, DashboardActivities } from '../../';

/* ---------------------------- Image Dependency ---------------------------- */
import { ReactComponent as Email } from 'assets/icons/icon-profile-email.svg';
import { ReactComponent as Call } from 'assets/icons/icon-profile-call.svg';
import { ReactComponent as Location } from 'assets/icons/icon-profile-location.svg';
import { ReactComponent as Copy } from 'assets/icons/icon-copy.svg';
import { connect } from 'react-redux';
import {
	selectCompanyLoading,
	selectCurrentCompany,
} from 'redux/accounts/selectors';
import { createStructuredSelector } from 'reselect';
import { getCompanyById, deleteCompany } from 'redux/accounts/actions';
import { useMount } from 'broad-state';
import Loader from 'components/loader';
import Avatar from 'components/avatar';
import isEmpty from 'codewonders-helpers/bundle-cjs/helpers/is-empty';
import { user_id } from 'utils/user_persist';
import { capitalize, copyToClipboard } from 'utils';
import Modal from 'components/modal';
import { ModalWrapper } from 'pages/dashboard/staff/views/staff-profile';
import { selectAuthUser } from 'redux/user/selectors';

/* ----------------------------- Companies propTypes ---------------------------- */
const propsTypes = {
	company: PropTypes.object,
	isLoading: PropTypes.bool,
	user: PropTypes.object,
	getCompanyById: PropTypes.func,
	deleteCompany: PropTypes.func,
};
const CompanyProfile = ({
	isLoading,
	user,
	company: companyData,
	getCompanyById,
	deleteCompany,
}) => {
	const { id: companyId } = useParams();
	const isAdmin = !isEmpty(user) && user?.role === 'ADMIN';
	useMount(() => {
		getCompanyById(companyId);
	});
	const company = companyData?.company;
	const [showDelete, setShowDelete] = useState(false);
	return (
		<>
			{!isLoading ? (
				<>
					<SubNavBar isBack>
						<div>
							<Link to="/dashboard/companies" className="back mb-3 d-block">
								{'<'} BACK
							</Link>

							<h3 className="d-flex">
								<Avatar data={company?.name || 'f'} isTile /> {company?.name}
							</h3>
						</div>
						<div className="other__information-text">
							<p className="mb-0">
								Created by:{' '}
								<strong>
									{company?.created_by?.first_name}{' '}
									{company?.created_by?.last_name}
								</strong>{' '}
								| Assigned to:
								<strong>
									{' '}
									{company?.blame_info?.first_name}{' '}
									{company?.blame_info?.last_name}
								</strong>
							</p>
						</div>{' '}
						{isAdmin ? (
							<div className="d-flex">
								<>
									<Link
										to={`/dashboard/companies/edit/${company?.id}`}
										className="btn-soft sm-size mr-3"
									>
										Update Company
									</Link>{' '}
									<Button
										className="btn btn-light-red"
										onClick={() => setShowDelete(true)}
									>
										Deactivate
									</Button>
								</>
							</div>
						) : null}
					</SubNavBar>
					<DashboardWrapper>
						<DashboardHeader>
							<div className="row">
								<div className="col-md-11 mr-auto">
									<div className="row">
										<div className="col-md-3">
											<div className="card purple">
												<div className="card-body">
													<p>Subscription Period</p>
													<h2>
														{company?.subscription_year}{' '}
														<small>
															year{company?.subscription_year > 1 && 's'}/{' '}
														</small>
														{company?.subscription_month}
														<small>
															month{company?.subscription_month > 1 && 's'}
														</small>
													</h2>
												</div>
											</div>
										</div>
										<div className="col-md-3">
											<div className="card orange">
												<div className="card-body">
													<p>Subscription Package</p>
													<small>
														{company?.employee_count} Employee counts
													</small>
													<br />
													{company?.license?.expiration_date && (
														<small>
															Expires at:{' '}
															{moment(company.license.expiration_date).format(
																'Do MMM, YYYY'
															)}
															<br />
														</small>
													)}
													<small>
														{company?.bought_payroll && 'Payroll'}{' '}
														{company?.bought_ess ? 'and ESS' : 'Only'}
													</small>
													<br />
													<small></small>
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
											<Activities data={companyData?.activity} />
										</div>
									</div>
								</div>
								<div className="col-md-4">
									<div className="license__code">
										<label>License Code</label>
										<div className="d-flex">
											<input
												value={company?.license?.code}
												disabled
												className="form-control"
											/>{' '}
											<Copy
												onClick={async () => {
													await copyToClipboard(company?.license?.code);
													alert('Copied to clipboard');
												}}
											/>
										</div>
									</div>
									<div className="card mb-4">
										<div className="card-body">
											<div className="tile-header variation-2">
												<h4>Company Information</h4>
											</div>
											<div className="company__contacts">
												<h4>
													<Email />
													{company?.email}
												</h4>
											</div>
											<div className="company__contacts">
												<h4>
													{' '}
													<Call />
													{company?.phone_number}
												</h4>
											</div>
											<div className="company__contacts">
												<h4>
													{' '}
													<Location />
													{company?.address}
												</h4>
											</div>
										</div>
									</div>
									{company?.contacts_name ||
									company?.contacts_email ||
									company?.contacts_phone_number ? (
										<div className="card mb-4">
											<div className="card-body">
												<div className="tile-header variation-2">
													<h4>Contacts Information</h4>
												</div>
												<div className="company__contacts">
													<h4>Name: {company?.contacts_name}</h4>
												</div>
												<div className="company__contacts">
													<h4>Email: {company?.contacts_email}</h4>
												</div>
												<div className="company__contacts">
													<h4>Address: {company?.contacts_phone_number}</h4>
												</div>
											</div>
										</div>
									) : null}
								</div>
							</div>
						</DashboardList>
					</DashboardWrapper>
				</>
			) : (
				<Loader loadingText="Getting Company" />
			)}
			<Modal show={showDelete} closeModal={setShowDelete} title={'Warning'}>
				<ModalWrapper>
					<p>
						Are you sure you want to delete <strong>{company?.name}</strong>,
						This action is irreversible.
					</p>

					<Button
						type="submit"
						className="btn btn-danger mt-3"
						isLoading={isLoading}
						disabled={isLoading}
						onClick={async () => {
							await deleteCompany(company?.id);
							setShowDelete(false);
						}}
					>
						Delete Company
					</Button>
				</ModalWrapper>
			</Modal>
		</>
	);
};

export const Activities = ({ data }) => {
	const updateMessage = (object, data, dataMessage) => {
		if (object?.employee_count !== data?.company?.employee_count) {
			dataMessage.unshift(
				`Employee Count from ${object?.employee_count} to ${data?.company?.employee_count}`
			);
		}
		if (object?.year !== data?.company?.subscription_year) {
			dataMessage.unshift(
				`Subscription Year(s) from ${object?.year} to ${data?.company?.subscription_year}`
			);
		}
		if (object?.month !== data?.company?.subscription_month) {
			dataMessage.unshift(
				`Subscription Month(s) from ${object?.month} to ${data?.company?.subscription_month}`
			);
		}
		return dataMessage.join(' , ');
	};
	return (
		<>
			{!isEmpty(data) ? (
				<>
					{data?.map((activity) => (
						<div className="activity__today">
							<h4 className="tile-text-accent">{activity?.heading}</h4>
							{activity?.data?.map((activity_tile) => (
								<div className="activity__today-tile">
									{!isEmpty(activity_tile?.company) ? (
										<Avatar data={activity_tile?.company?.name || 's'} isTile />
									) : (
										<>
											{activity_tile?.staff?.profile_picture ? (
												<img
													src={activity_tile?.staff?.profile_picture}
													alt="Barter"
													className="mr-3 rounded-circle"
												/>
											) : (
												<Avatar
													data={{
														first_name: activity_tile?.staff?.first_name,
														last_name: activity_tile?.staff?.last_name,
													}}
												/>
											)}
										</>
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
											`a new ${activity_tile?.company ? 'company' : 'staff'}`}
										{activity_tile?.action === 'CHANGE' &&
										activity_tile?.previous
											? updateMessage(
													activity_tile?.previous,
													activity_tile,
													[]
											  )
											: null}
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
											{moment(new Date(activity_tile?.timestamp)).fromNow()}
										</span>
									</h4>
								</div>
							))}
						</div>
					))}
				</>
			) : (
				<div className="activity__today">
					<div className="activity__today-tile">
						<h4>No Activities Yet</h4>
					</div>
				</div>
			)}
		</>
	);
};
export const DashboardList = styled(DashboardActivities)`
	.company__contacts {
		margin-bottom: 1.5rem;
		h4 {
			font-style: normal;
			font-weight: normal;
			font-size: 14px;
			line-height: 18px;
			letter-spacing: 0.02em;

			/* Text/Grey */

			color: #4c4e51;
		}
		svg {
			margin-right: 0.8rem;
		}
	}
	.license__code {
		margin-bottom: 2rem;
		margin-top: -6rem;
		@media (max-width: 990px) {
			margin-top: 0rem;
		}
		label {
			font-style: normal;
			font-weight: normal;
			font-size: 14px;
			line-height: 18px;
			letter-spacing: 0.02em;

			/* Text/Grey */

			color: #4c4e51;
		}
		svg {
			margin-left: 1rem;
		}
		input {
			background: #ffffff;
			border-radius: 8px;
			border: none;
			font-style: normal;
			font-weight: normal;
			font-size: 14px;
			line-height: 18px;
			letter-spacing: 0.02em;

			/* Text/Black */

			color: #141515;
		}
	}
`;
CompanyProfile.propsTypes = propsTypes;
const mapStateToProps = createStructuredSelector({
	company: selectCurrentCompany,
	user: selectAuthUser,
	isLoading: selectCompanyLoading,
});
export default connect(mapStateToProps, { getCompanyById, deleteCompany })(
	CompanyProfile
);
