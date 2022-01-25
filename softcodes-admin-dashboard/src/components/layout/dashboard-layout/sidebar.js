import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { ReactComponent as Dashboard } from 'assets/icons/icon-dashboard.svg';
import { ReactComponent as Companies } from 'assets/icons/icon-companies.svg';
import { ReactComponent as Staff } from 'assets/icons/icon-staff.svg';

import { ReactComponent as Support } from 'assets/icons/icon-support.svg';

const SideBar = ({ location }) => {
	return (
		<Aside>
			<div className="side__bar-items">
				<Items
					className={`${location?.pathname === '/dashboard' && 'is-active'}`}
					to="/dashboard"
				>
					<Dashboard />
					Dashboard
				</Items>
				<Items
					className={`${location?.pathname?.includes('/dashboard/compan') &&
						'is-active'}`}
					to="/dashboard/companies"
				>
					<Companies className="companies" />
					Companies
				</Items>
				<Items
					className={`${location?.pathname?.includes('/dashboard/staff') &&
						'is-active'}`}
					to="/dashboard/staff"
				>
					<Staff />
					Staff
				</Items>
				<hr />
				<Items
					className={`${location?.pathname?.includes('/dashboard/support') &&
						'is-active'}`}
					to="/dashboard/sfd"
				>
					<Support />
					Support
				</Items>
			</div>
		</Aside>
	);
};

const Aside = styled.aside`
	background: var(--white);
	height: calc(100% - 72px);
	width: 210px;
	position: fixed;
	bottom: 0;
	left: 0;
	padding: 1.5rem;

	border-right: 1px solid #e4e7e8;
	box-sizing: border-box;
	box-shadow: 4px 0px 18px -6px rgba(35, 49, 62, 0.15);
	transition: all 0.3s ease;
	@media screen and (max-width: 990px) {
		transform: translate(-400px);
		z-index: 99999;
		width: 75% !important;
		&:before {
			content: '';
			position: absolute;
			background: #000000a6;
			top: 0;
			height: 100%;
			width: calc(100% - 62.5%);
			right: -28vw;
			z-index: -1;
		}
	}
`;
const Items = styled(Link)`
	padding: 10px 15px;
	display: block;
	margin-bottom: 1rem;
	border-radius: 6px;
	transition: all 0.4s linear;

	font-family: 'DM Sans';
	font-style: normal;
	font-weight: normal;
	font-size: var(--font-p);
	line-height: 18px;
	letter-spacing: 0.02em;

	/* Grey */

	color: var(--gray);
	&:hover {
		background: #3185d314;
		text-decoration: none;
	}

	svg,
	img {
		display: inline-block;
		margin-right: 9.5px;

		&:not(.companies) {
			path {
				fill: var(--gray);
			}
		}
		&.companies {
			stroke: var(--gray);
		}
	}
	&.is-active {
		color: #3286d4 !important;
		background: rgba(255, 255, 255, 0.05);
		position: relative;
		&:before {
			left: -15%;
			background: #3286d4;
			content: '';
			position: absolute;
			right: 100%;
			height: 100%;

			border-radius: 0px 50px 50px 0px;
			width: 5px;
			top: 0;
		}
		svg {
			&:not(.companies) {
				path {
					fill: var(--primary-blue) !important;
				}
			}
			&.companies {
				path {
					stroke: var(--primary-blue) !important;
				}
			}
		}
	}
`;

export default withRouter(SideBar);
