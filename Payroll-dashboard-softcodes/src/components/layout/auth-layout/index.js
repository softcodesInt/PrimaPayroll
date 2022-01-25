/* -------------------------------------------------------------------------- */
/*                            External Dependecies                            */
/* -------------------------------------------------------------------------- */
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';

/* --------------------------- Internal Dependency -------------------------- */
import isAuthenticated from 'utils/is-authenticated';

/* ---------------------------- Image Dependency ---------------------------- */
// import { ReactComponent as Logo } from '../../../assets/icons/logos.png';

/* -------------------------- AuthLayout PropTypes -------------------------- */
const propTypes = {
	children: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
};

/* ------------------------- AuthLayout defaultProps ------------------------ */
const defaultProps = {
	children: <></>,
};

const AuthLayout = ({ children }) => {
	if (isAuthenticated()) {
		return <Redirect to="/dashboard" />;
	}
	return (
		<>
			<Wrapper>
				<div className="grid_layout d-block d-md-grid">
					<div className="grid-1 d-none d-md-block">
						<img
							// eslint-disable-next-line global-require
							src={require('../../../assets/images/Liquid-Cheese.png')}
							alt="layout banner"
						/>
					</div>
					<div className="grid-2 d-flex">
						<div className="child__item container" data-testid="auth-layout">
							<div className="col-lg-7">
								<Link to="/">
									<img
										// eslint-disable-next-line global-require
										src={require('../../../assets/icons/logos.png')}
										alt="layout logo"
										className="mb-4 logo"
									/>
								</Link>
								{children}
							</div>
						</div>
					</div>
				</div>
			</Wrapper>
		</>
	);
};

const Wrapper = styled.div`
	.d-md-grid {
		@media (min-width: 768px) {
			display: grid !important;
		}
	}
	.logo {
		width: 147px;
	}
	.grid_layout {
		display: grid;
		min-height: 100vh;
		grid-template-columns: 0.5fr 1.5fr;
		grid-template-rows: 100%;
		grid-column-gap: 0px;
		background: var(--white);
		.grid {
			&-2 {
				display: flex;

				justify-content: center;
				padding: 4rem 4.5rem;
				@media (max-width: 768px) {
					padding: 0;
					height: 100%;
				}
				/* .child__item {
					flex: 0.589 0;
					@media (max-width: 768px) {
						flex: 1 0 !important;
					}
				} */
			}
			&-1 {
				img {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
			}
		}
	}
`;

export const AuthStylingLayoutChildren = styled.div`
	h3 {
		margin-bottom: 4px;
		margin-top: 1.55rem;
		font-style: normal;
		font-weight: bold;
		font-size: var(--font-h1);
		line-height: 45px;
		/* identical to box height */

		letter-spacing: -0.03em;

		/* Text/Black */

		color: var(--text-black);
	}

	.intro__text {
		font-style: normal;
		font-weight: normal;
		font-size: var(--font-p);
		line-height: 18px;
		letter-spacing: 0.02em;

		margin-bottom: 3.6rem;

		color: var(--text-gray);
	}
	.intro__link-ext {
		margin-top: -10px;

		font-style: normal;
		font-weight: normal;
		font-size: var(--font-accent);
		line-height: 15px;
		/* identical to box height */

		letter-spacing: 0.03em;

		/* Text/Grey */

		a {
			color: var(--primary-blue);
		}
	}
	.intro__link-link-out {
		font-size: 14px;
		margin-top: 1rem;
		text-align: center;
		font-weight: 300;
	}
	button {
		margin-top: 2.2rem;
	}
`;

AuthLayout.defaultProps = defaultProps;

AuthLayout.propTypes = propTypes;

export default AuthLayout;
