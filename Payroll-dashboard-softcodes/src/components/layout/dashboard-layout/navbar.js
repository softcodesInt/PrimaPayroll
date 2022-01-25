import React from 'react';
import PropTypes from 'prop-types';
import { Nav, Navbar, NavDropdown, NavLink } from 'react-bootstrap';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useMount, useBroadState } from 'broad-state';
import { selectAuthUser, selectisLoading } from 'redux/user/selectors';
import { getCurrentUser, logOutUser } from 'redux/user/actions';

import isEmpty from 'codewonders-helpers/bundle-cjs/helpers/is-empty';
import Avatar from 'components/avatar';
import { Link } from 'react-router-dom';
import { user_id } from 'utils/user_persist';
import { SideBarContext } from './sidebar';

const propsTypes = {
	logOutUserAction: PropTypes.func,
	getCurrentUserAction: PropTypes.func,
	user: PropTypes.shape({
		first_name: PropTypes.string.isRequired,
		last_name: PropTypes.string.isRequired,
		profile_picture: PropTypes.string.isRequired,
	}).isRequired,
	children: PropTypes.node,
};

const NavLayout = ({
	user,
	getCurrentUserAction,
	logOutUserAction,
	children,
}) => {
	useMount(() => {
		if (isEmpty(user)) {
			getCurrentUserAction();
		}
	});
	const [show, toggleSideBar] = useBroadState(SideBarContext);
	return (
		<NavbarWrapper
			collapseOnSelect
			expand="lg"
			bg="light"
			variant="light"
			fixed="top"
		>
			<div className="container-fluid">
				<div className="logo-wrapper">
					{!isEmpty(user) ? (
						<>
							{!user?.company?.logo ? (
								<Avatar isTile data={user?.company?.name} size={35} />
							) : (
								<img src={user?.company?.logo} alt="company logo" />
							)}
							<h4 className="company-name">{user?.company?.name}</h4>
						</>
					) : (
						<h4>...</h4>
					)}
				</div>
				<button
					className={`navbar-toggler ${
						isEmpty(children) ? 'is-not-actions' : 'is-actions'
					}`}
					type="button"
					onClick={() => toggleSideBar(!show)}
				>
					<span className="navbar-toggler-icon" />
				</button>
				<div className="d-flex d-lg-block">
					<Nav className="ml-auto">
						{children}
						{!isEmpty(children) ? (
							<span className="space__margins d-none d-lg-inline" />
						) : null}
						{!isEmpty(user) && (
							<Nav className="ml-auto">
								<NavDropdown
									title={
										<span className="d-flex align-items-center">
											{user?.profile_picture ? (
												<img src={user?.profile_picture} alt="avatar" />
											) : (
												<Avatar data={user} />
											)}
											<span style={{ color: '#ffffff' }}>
												{user?.first_name} {user?.last_name}
											</span>
										</span>
									}
									id="collasible-nav-dropdown"
								>
									<Link
										className="dropdown-item"
										to={`/dashboard/staffs/${user_id}`}
									>
										Profile
									</Link>
									<NavDropdown.Divider />
									<NavDropdown.Item
										href="#!"
										onClick={() => logOutUserAction()}
									>
										Log Out
									</NavDropdown.Item>
								</NavDropdown>
							</Nav>
						)}
					</Nav>
					{/* </Nav> */}
				</div>
			</div>
		</NavbarWrapper>
	);
};
export const NavItem = styled(NavLink)`
	font-style: normal;
	font-weight: 500;
	font-size: var(--font-p);
	line-height: 18px;
	letter-spacing: 0.02em;
	border-radius: 8px;
	margin-right: 1.2rem;
	padding: 14px 0px !important;
	&.light-blue {
		background: var(--light-blue);
		color: var(--primary-blue) !important;
	}
	&.light-red {
		background: #f9ece9;

		color: #c54124 !important;
	}
`;
const NavbarWrapper = styled(Navbar)`
	background: var(--primary-purple) !important;
	border-bottom: 0;
	box-shadow: 0 2px 6px -2px rgb(0 0 0 / 16%), 0 2px 6px 0 rgb(0 0 0 / 12%);
	padding: 0 10px 0 0;
	z-index: 1001;
	height: 70px;
	box-sizing: border-box;
	padding: 13px 13px;
	width: calc(100%);
	color: rgba(255, 255, 255, 0.6);
	@media (max-width: 990px) {
		width: 100%;

		margin: 0;
	}

	margin-left: auto;
	.navbar-toggler {
		border: none;
		&.is-actions {
			@media (min-width: 477px) {
				order: 3;
			}
		}
		&.is-not-actions {
			@media (min-width: 378px) {
				order: 3;
			}
		}
	}
	.space__margins {
		display: block;
		background: rgba(0, 0, 0, 0.2);
		width: 1px;
		margin: 5px 23px;
	}
	.navbar-brand {
		h4 {
			font-style: normal;
			font-weight: 500;
			font-size: var(--font-h3);
			line-height: 28px;
			letter-spacing: -0.015em;
			margin: 0;
			text-transform: capitalize;
			color: #000000;
		}
		button {
			font-style: normal;
			font-weight: 500;
			font-size: 13px;
			margin-bottom: 5px;
			display: block;
			margin-top: -8px;
			line-height: 18px;
			letter-spacing: 0.02em;
			text-transform: uppercase;
			/* Text/Grey */

			color: var(--text-gray);
			border: none;
			background: transparent;
			&.v-n {
				visibility: hidden;
			}
		}
	}
	.dropdown {
		&-toggle {
			display: flex;
			align-items: center;
			&:after {
				padding: 3px;
				margin-left: 0.455em;
				border-image: initial;
				transform: rotate(45deg);
				border-top: 0px solid red;
				border-right: 1px solid rgb(99, 99, 99) !important;
				border-bottom: 1px solid rgb(99, 99, 99) !important;
				border-left: 0px solid rgb(99, 99, 99) !important;
			}
		}
		span.d-flex {
			margin: 0;
		}
		img {
			height: 30px;
			width: 30px;
			margin-right: 8px;
			object-fit: cover;
			border-radius: 50%;
		}
	}
	.navbar-nav {
		@media (max-width: 990px) {
			flex-direction: row;
		}
	}
	.nav-link {
		padding-right: 1rem !important;
		padding-left: 1rem !important;
		&.notifications {
			border-right: 0.5px solid rgba(0, 0, 0, 0.2);
		}
	}
	.nav-item {
		a {
			font-style: normal;
			font-weight: normal;
			font-size: var(--font-p);
			line-height: 18px;
			letter-spacing: 0.02em;

			/* Text/Black */

			color: var(--text-black) !important;
		}
	}
`;
NavLayout.propTypes = propsTypes;

const mapStateToProps = createStructuredSelector({
	isLoading: selectisLoading,
	user: selectAuthUser,
});
export default connect(mapStateToProps, {
	getCurrentUserAction: getCurrentUser,
	logOutUserAction: logOutUser,
})(NavLayout);
