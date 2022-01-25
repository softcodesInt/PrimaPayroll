import React from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import {
	BsFillPeopleFill,
	BsCashStack,
	BsFillCalendar2DayFill,
	BsFillCloudUploadFill,
} from 'react-icons/bs';
import { ReactComponent as Staff } from 'assets/icons/icon-staff.svg';
import { ReactComponent as CompanyStructure } from 'assets/icons/icon-company-structure.svg';
import { ReactComponent as Leaves } from 'assets/icons/icon-leaves.svg';
import { ReactComponent as Subsidiary } from 'assets/icons/icon-subsidiary.svg';
import { ReactComponent as Policy } from 'assets/icons/icon-policy.svg';
import { ReactComponent as Payroll } from 'assets/icons/icon-pay-roll.svg';
import { ReactComponent as Remuneration } from 'assets/icons/icon-remuneration.svg';
import { createStructuredSelector } from 'reselect';
import { createObservable, useBroadState } from 'broad-state';
import { connect } from 'react-redux';
import { selectAuthUser } from 'redux/user/selectors';
import { isAdminUser } from 'utils/is-authenticated';

const propTypes = {
	location: PropTypes.shape,
	user: PropTypes.shape({
		first_name: PropTypes.string.isRequired,
		last_name: PropTypes.string.isRequired,
		profile_picture: PropTypes.string.isRequired,
		company: PropTypes.shape,
	}).isRequired,
};

export const SideBarContext = createObservable(false);
const SideBar = ({ location, user }) => {
	const [showSideBar, toggleSideBar] = useBroadState(SideBarContext);
	return (
		<Aside className={showSideBar ? 'show' : ''}>
			<div className="before" onClick={() => toggleSideBar(false)} />
			<div className="side__bar-items">
				{/* <Items
					className={`${location?.pathname === '/dashboard' && 'is-active'}`}
					onClick={() => toggleSideBar(false)}
					to="/dashboard"
				>
					<Dashboard />
					Dashboard
				</Items> */}
				{isAdminUser() ? (
					<>
						<Items
							className={`${location?.pathname.includes(
								'/dashboard/employee'
							) && 'is-active'}`}
							onClick={() => toggleSideBar(false)}
							to="/dashboard/employee/list"
						>
							<BsFillPeopleFill style={{ fontSize: '20px' }} />
							Employees
						</Items>
						{location?.pathname.includes('/dashboard/employee') && (
							<div className="nav__dropdown">
								<NavLink
									activeClassName="is-active"
									onClick={() => toggleSideBar(false)}
									to="/dashboard/employee/add?page=employee-info"
								>
									Add New Employee
								</NavLink>
								<NavLink
									activeClassName="is-active"
									onClick={() => toggleSideBar(false)}
									to="/dashboard/employee/list"
								>
									Employees
								</NavLink>
							</div>
						)}
						<Items
							className={`${location?.pathname.includes(
								'/dashboard/company-structure'
							) && 'is-active'}`}
							onClick={() => toggleSideBar(false)}
							to="/dashboard/company-structure"
						>
							<CompanyStructure />
							Company Structure
						</Items>
						<Items
							className={`${(location?.pathname.includes('/dashboard/leaves') ||
								location?.pathname.includes('/dashboard/workflow')) &&
								'is-active'}`}
							onClick={() => toggleSideBar(false)}
							to="/dashboard/leaves"
						>
							<Leaves />
							Leaves
						</Items>
						{(location?.pathname.includes('/dashboard/leaves') ||
							location?.pathname.includes('/dashboard/workflow')) && (
							<div className="nav__dropdown">
								<NavLink
									activeClassName="is-active"
									onClick={() => toggleSideBar(false)}
									to="/dashboard/leaves"
								>
									Leaves
								</NavLink>
								<NavLink
									activeClassName="is-active"
									onClick={() => toggleSideBar(false)}
									to="/dashboard/workflow/leaves"
								>
									Leave Workflow
								</NavLink>
								{user?.company?.bought_ess && (
									<NavLink
										activeClassName="is-active"
										onClick={() => toggleSideBar(false)}
										to="/dashboard/request/leaves/"
									>
										Employee Request
									</NavLink>
								)}
							</div>
						)}
						<Items
							className={`${location?.pathname.includes(
								'/dashboard/subsidiaries'
							) && 'is-active'}`}
							onClick={() => toggleSideBar(false)}
							to="/dashboard/subsidiaries"
						>
							<Subsidiary />
							Subsidiaries
						</Items>
						<Items
							className={`${location?.pathname.includes(
								'/dashboard/policies'
							) && 'is-active'}`}
							onClick={() => toggleSideBar(false)}
							to="/dashboard/policies"
						>
							<Policy />
							Policies
						</Items>
						<Items
							className={`${location?.pathname.includes('/dashboard/payroll') &&
								'is-active'}`}
							onClick={() => toggleSideBar(false)}
							to="/dashboard/payroll/earnings"
						>
							<Payroll className="companies" />
							Payroll
						</Items>
						{location?.pathname.includes('/dashboard/payroll') && (
							<div className="nav__dropdown">
								<NavLink
									activeClassName="is-active"
									onClick={() => toggleSideBar(false)}
									to="/dashboard/payroll/earnings"
								>
									Earnings
								</NavLink>
								<NavLink
									activeClassName="is-active"
									onClick={() => toggleSideBar(false)}
									to="/dashboard/payroll/deductions"
								>
									Deductions
								</NavLink>

								<NavLink
									activeClassName="is-active"
									onClick={() => toggleSideBar(false)}
									to="/dashboard/payroll/contributions"
								>
									Company Contributions
								</NavLink>
								<NavLink
									activeClassName="is-active"
									onClick={() => toggleSideBar(false)}
									to="/dashboard/payroll/fringe-benefits"
								>
									Fringe Benefits
								</NavLink>
								<NavLink
									activeClassName="is-active"
									onClick={() => toggleSideBar(false)}
									to="/dashboard/payroll/provisions"
								>
									Provisions
								</NavLink>
								<NavLink
									activeClassName="is-active"
									onClick={() => toggleSideBar(false)}
									to="/dashboard/payroll/additions"
								>
									Additions
								</NavLink>
								<NavLink
									activeClassName="is-active"
									onClick={() => toggleSideBar(false)}
									to="/dashboard/payroll/payroll-categories"
								>
									Payroll groups
								</NavLink>
								<NavLink
									activeClassName="is-active"
									onClick={() => toggleSideBar(false)}
									to="/dashboard/payroll/employee"
								>
									Employees
								</NavLink>
								<NavLink
									activeClassName="is-active"
									onClick={() => toggleSideBar(false)}
									to="/dashboard/payroll/loan-setup"
								>
									Loan Setup
								</NavLink>
							</div>
						)}
						<Items
							className={`${location?.pathname.includes(
								'/dashboard/remuneration'
							) && 'is-active'}`}
							onClick={() => toggleSideBar(false)}
							to="/dashboard/remuneration"
						>
							<Remuneration />
							Remuneration
						</Items>
						<Items
							className={`${location?.pathname.includes(
								'/dashboard/tax-management'
							) && 'is-active'}`}
							onClick={() => toggleSideBar(false)}
							to="/dashboard/tax-management/tax-relief-group"
						>
							<BsCashStack style={{ fontSize: '20px' }} />
							Tax Management
						</Items>
						{location?.pathname.includes('/dashboard/tax-management') && (
							<div className="nav__dropdown">
								<NavLink
									activeClassName="is-active"
									onClick={() => toggleSideBar(false)}
									to="/dashboard/tax-management/tax-relief-group"
								>
									Tax Relief Groups
								</NavLink>
								<NavLink
									activeClassName="is-active"
									onClick={() => toggleSideBar(false)}
									to="/dashboard/tax-management/tax-relief"
								>
									Tax Reliefs
								</NavLink>
								<NavLink
									activeClassName="is-active"
									onClick={() => toggleSideBar(false)}
									to="/dashboard/tax-management/tax-table"
								>
									Tax Table
								</NavLink>
								<NavLink
									activeClassName="is-active"
									onClick={() => toggleSideBar(false)}
									to="/dashboard/tax-management/employee-driven"
								>
									Employee-Driven Relief
								</NavLink>
							</div>
						)}
						<Items
							className={`${location?.pathname.includes(
								'/dashboard/transactions'
							) && 'is-active'}`}
							onClick={() => toggleSideBar(false)}
							to="/dashboard/transactions/"
						>
							<BsFillCalendar2DayFill style={{ fontSize: '20px' }} />
							Transactions
						</Items>
						<Items
							className={`${location?.pathname.includes(
								'/dashboard/settings/banks'
							) && 'is-active'}`}
							onClick={() => toggleSideBar(false)}
							to="/dashboard/settings/banks"
						>
							<Policy />
							Settings
						</Items>
						{location?.pathname.includes('/dashboard/settings') && (
							<div className="nav__dropdown">
								<NavLink
									activeClassName="is-active"
									onClick={() => toggleSideBar(false)}
									to="/dashboard/settings/holiday-setup"
								>
									Holiday setup
								</NavLink>
								<NavLink
									activeClassName="is-active"
									onClick={() => toggleSideBar(false)}
									to="/dashboard/settings/banks"
								>
									Banks
								</NavLink>
								<NavLink
									activeClassName="is-active"
									onClick={() => toggleSideBar(false)}
									to="/dashboard/settings/job-title"
								>
									Job title
								</NavLink>

								<NavLink
									activeClassName="is-active"
									onClick={() => toggleSideBar(false)}
									to="/dashboard/settings/nature-of-contract"
								>
									Nature of contract
								</NavLink>
								<NavLink
									activeClassName="is-active"
									onClick={() => toggleSideBar(false)}
									to="/dashboard/settings/job-grades"
								>
									Job Grades
								</NavLink>
								<NavLink
									activeClassName="is-active"
									onClick={() => toggleSideBar(false)}
									to="/dashboard/settings/terminate-reason"
								>
									Terminate Reason
								</NavLink>
								<NavLink
									activeClassName="is-active"
									onClick={() => toggleSideBar(false)}
									to="/dashboard/settings/reinstate-reason"
								>
									Reinstate Reason
								</NavLink>
								<NavLink
									activeClassName="is-active"
									onClick={() => toggleSideBar(false)}
									to="/dashboard/settings/pension"
								>
									Pension
								</NavLink>
								<NavLink
									activeClassName="is-active"
									onClick={() => toggleSideBar(false)}
									to="/dashboard/settings/backup-restore"
								>
									Backup/Restore
								</NavLink>
							</div>
						)}
						<Items
							className={`${location?.pathname.includes(
								'/dashboard/export-import'
							) && 'is-active'}`}
							onClick={() => toggleSideBar(false)}
							to="/dashboard/export-import/"
						>
							<BsFillCloudUploadFill style={{ fontSize: '20px' }} />
							Export/Import
						</Items>
						<Items
							className={`${location?.pathname.includes(
								'/dashboard/user-access'
							) && 'is-active'}`}
							onClick={() => toggleSideBar(false)}
							to="/dashboard/user-access/"
						>
							<Staff />
							User Access
						</Items>
					</>
				) : (
					<>
						<Items
							className={`${location?.pathname.includes('/ess/me') &&
								'is-active'}`}
							onClick={() => toggleSideBar(false)}
							to="/dashboard/ess/me"
						>
							<Staff />
							Your Details
						</Items>
						<Items
							className={`${location?.pathname.includes('/ess/payslips') &&
								'is-active'}`}
							onClick={() => toggleSideBar(false)}
							to="/dashboard/ess/payslips"
						>
							<Remuneration />
							Payslips
						</Items>
						<Items
							className={`${location?.pathname.includes('/ess/leaves') &&
								'is-active'}`}
							onClick={() => toggleSideBar(false)}
							to="/dashboard/ess/leaves"
						>
							<Leaves />
							Leaves Status
						</Items>
						<Items
							className={`${location?.pathname.includes('/ess/leave-request') &&
								'is-active'}`}
							onClick={() => toggleSideBar(false)}
							to="/dashboard/ess/leave-request"
						>
							<Leaves />
							Leave Request
						</Items>
					</>
				)}
			</div>
		</Aside>
	);
};

const Aside = styled.aside`
	background: #fff;
	box-sizing: border-box;
	box-shadow: 0 2px 6px -2px rgb(0 0 0 / 16%), 0 2px 6px 0 rgb(0 0 0 / 12%);
	height: 100%;
	width: 255px;
	position: fixed;
	bottom: 0;
	top: 70px;
	left: 0;
	overflow-y: auto;
	padding: 1rem 1.2rem 0.2rem 1rem;

	border-right: 1px solid #e4e7e8;
	transition: all 0.3s ease;

	@media screen and (max-width: 990px) {
		transform: translate(-700px);
		z-index: 99999;
		width: 75vw !important;
		&.show {
			transform: translate(0px);
			.before {
				content: '';
				position: absolute;
				background: #000000a6;
				top: 0;
				height: 100%;
				width: calc(100% - 31.5%);
				right: -68%;
				z-index: 1;
			}
		}
	}
	.nav__dropdown {
		padding-left: 2rem;

		a {
			display: block;
			font-weight: normal;
			font-size: 14px;
			line-height: 18px;
			letter-spacing: 0.02em;
			color: #4c4e51;
			margin-bottom: 0.89rem;
			&.is-active {
				color: #336ee4;
			}
		}
	}
	.company__logo {
		display: flex;
		margin-top: 7px;
		align-items: center;
		margin-bottom: 2rem;
		h4 {
			font-style: normal;
			font-weight: bold;
			font-size: 16px;
			line-height: 21px;
			/* identical to box height */

			letter-spacing: 0.005em;
			margin: 0;
			/* Text/Black */

			color: var(--text-black);
		}
		img {
			object-fit: cover;
			margin-right: 9px;
			border-radius: 10px;
			width: 35px;
			height: 35px;
		}
	}
`;
const Items = styled(Link)`
	padding: 12px 15px 12px 0px;
	display: block;
	margin-bottom: 0.1rem;
	border-radius: 6px;
	transition: all 0.25s linear;

	border-left: 3px solid transparent;
	color: var(--secondary-text-color);
	cursor: pointer;
	display: block;
    font-size: 13.4px;
	position: relative;
	text-decoration: none;
	transition: background 0.1s ease-in-out;

	font-style: normal;
	font-weight: 500;
	line-height: 18px;
	letter-spacing: 0.02em;

	/* Greyed out */

	// color: #535a60;

	&:hover {
		text-decoration: none;
		color: var(--primary-color);
	}

	svg {
		display: inline-block;
		margin-right: 9.5px;
		width: 22px;
		path {
			fill: var(--secondary-text-color) !important;
		}
		rect {
			fill: var(--secondary-text-color) !important;
		}
	}
	&.is-active {
		width: 100%;
		color: var(--primary-color) !important;
		position: relative;
		margin-left: -10px;
		padding-left: 10px;
		&:before {
			@media screen and (max-width: 990px) {
				content: unset;
			}
			right: -12%;
			background: var(--primary-blue);
			content: '';
			position: absolute;
			/* right: 100%; */
			height: 100%;
			border-radius: 0px;
			width: 3px;
			top: 0;
		}
		svg {
			&:not(.companies) {
				path {
					fill: var(--primary-blue) !important;
				}
			}
			&.companies {
				rect {
					fill: var(--primary-blue) !important;
				}
			}
			background: linear-gradient(
				90deg,
				rgba(59, 125, 221, 0.1),
				rgba(59, 125, 221, 0.0875) 50%,
				transparent
			) !important;
			border-left-color: #3b7ddd;
			color: #e9ecef; !important;
		}
	}
`;

SideBar.propTypes = propTypes;

const mapStateToProps = createStructuredSelector({
	user: selectAuthUser,
});
export default connect(mapStateToProps, null)(withRouter(SideBar));
