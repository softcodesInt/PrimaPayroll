/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React from 'react';
import PropTypes from 'prop-types';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useMount } from 'broad-state';
/* -------------------------- Internal Dependencies ------------------------- */
import { selectAuthUser, selectisLoading } from 'redux/user/selectors';
import { getCurrentUser, logOutUser } from 'redux/user/actions';

/* --------------------------- Image Dependencies --------------------------- */
import Logo from 'assets/icons/logos.png';
import isEmpty from 'codewonders-helpers/bundle-cjs/helpers/is-empty';
import Avatar from 'components/avatar';
import { Link } from 'react-router-dom';
import { user_id } from 'utils/user_persist';

/* ----------------------------- Login propTypes ---------------------------- */
const propsTypes = {
	isLoading: PropTypes.bool,
	signInUser: PropTypes.func,
	logOutUser: PropTypes.func,
};
const NavLayout = ({ isLoading, user, getCurrentUser, logOutUser }) => {
	useMount(() => {
		if (isEmpty(user)) {
			getCurrentUser();
		}
	});
	return (
		<NavbarWrapper
			collapseOnSelect
			expand="lg"
			bg="light"
			variant="light"
			fixed="top"
		>
			<div className="container-fluid">
				<Navbar.Brand href="/">
					<img src={Logo} alt="Logo" />
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
				<Navbar.Collapse id="responsive-navbar-nav">
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
										<span>
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
								<NavDropdown.Item href="#!" onClick={() => logOutUser()}>
									Log Out
								</NavDropdown.Item>
							</NavDropdown>
						</Nav>
					)}
				</Navbar.Collapse>
			</div>
		</NavbarWrapper>
	);
};

export const SubNavBar = styled.header`
	background: #fff;
	padding: 25px 2.85rem 18px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	${(props) =>
		props.isBack &&
		css`
			position: relative;
			padding: 39px 2.85rem 18px;
		`}
	h3 {
		font-weight: 500;
		font-size: calc(var(--font-h2) - 4px);
		line-height: 36px;
		/* identical to box height */

		letter-spacing: -0.015em;

		/* Text/Black */
		margin: 0;
		color: var(--text-black);
	}
	p {
		font-style: normal;
		font-weight: normal;
		font-size: var(--font-p);
		line-height: 18px;
		letter-spacing: 0.02em;

		color: var(--text-black);
	}
	a.back {
		font-style: normal;
		font-weight: 500;
		position: absolute;
		top: 11px;
		font-size: var(--font-p);
		line-height: 18px;
		letter-spacing: 0.02em;

		/* Text/Grey */

		color: var(--text-gray);
	}
	img {
		height: 40px;
		width: 40px;
		object-fit: cover;
		border-radius: 10px;
	}
	.upload__image {
		position: absolute;
		margin-left: 2.3rem;
		margin-top: -2rem;
		background: white;
		border-radius: 50%;
		cursor: pointer;
		&-wrap {
			position: relative;
			height: 20px;
			width: 20px;
			overflow: hidden;
			cursor: pointer;
		}
		input {
			width: 100%;
			position: absolute;
			background: red;
			height: 100%;
			top: 0;
			opacity: 0;
			left: 0;
			cursor: pointer;
		}
		svg {
			position: absolute;
			left: 0;
			top: 0;
			cursor: pointer;
			height: 100%;
			width: 100%;
		}
	}
`;
const NavbarWrapper = styled(Navbar)`
	background: #ffffff;
	border-bottom: 1px solid #e4e7e8;
	box-sizing: border-box;
	padding: 13px 13px;
	box-shadow: 0px 2px 18px -6px rgba(35, 49, 62, 0.15);
	.navbar-brand {
		img {
			width: 120px;
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
NavLayout.propsTypes = propsTypes;
const mapStateToProps = createStructuredSelector({
	isLoading: selectisLoading,
	user: selectAuthUser,
});
export default connect(mapStateToProps, { getCurrentUser, logOutUser })(
	NavLayout
);
