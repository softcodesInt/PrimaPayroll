/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import styled from 'styled-components';
import { HelmetProvider } from 'react-helmet-async';

/* -------------------------- Internal Dependencies ------------------------- */
import ErrorBoundary from 'components/error-boundary';
import Login from 'pages/auth/login';
import Forgot from 'pages/auth/forgotpassword';
import Reset from 'pages/auth/reset';
import DashboardRoutes from './dashboard';
import ProtectedRoute from 'components/protected-routes';

/* ---------------------------- Routes PropTypes ---------------------------- */
const propTypes = {
	location: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

const Routes = ({ location }) => (
	<HelmetProvider>
		<Wrapper>
			<ErrorBoundary>
				<TransitionGroup>
					<CSSTransition
						key={location.key}
						timeout={{ enter: 300, exit: 300 }}
						classNames="fade"
					>
						<Switch location={location}>
							<Route exact path="/" component={Login} />
							<Route exact path="/forgot" component={Forgot} />
							<Route exact path="/reset-password/:id" component={Reset} />
							<ProtectedRoute path="/dashboard" component={DashboardRoutes} />
						</Switch>
					</CSSTransition>
				</TransitionGroup>
			</ErrorBoundary>
		</Wrapper>
	</HelmetProvider>
);

const Wrapper = styled.div`
	.fade-enter {
		opacity: 0.6;
	}
	.fade-enter.fade-enter-active {
		opacity: 1;
		transition: opacity 0.4s ease-in;
	}
	.fade-exit {
		opacity: 1;
	}
	.fade-exit.fade-exit-active {
		opacity: 0.6;
		transition: opacity 0.4s ease-in;
	}
`;

Routes.propTypes = propTypes;

export default withRouter(Routes);
