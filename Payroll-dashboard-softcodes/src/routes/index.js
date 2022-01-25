import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { HelmetProvider } from 'react-helmet-async';

import ErrorBoundary from 'components/error-boundary';
import Login from 'pages/auth/login';
import Register from 'pages/auth/register';
import Forgot from 'pages/auth/forgotpassword';
import Reset from 'pages/auth/reset';
import License from 'pages/auth/license';
import ProtectedRoute from 'components/protected-routes';
import DashboardRoutes from './dashboard';

const propTypes = {
	location: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

const Routes = ({ location }) => (
	<HelmetProvider>
		<Wrapper>
			<ErrorBoundary>
				<Switch>
					<Route exact path="/" component={Login} />
					<Route exact path="/register/:id" component={Register} />
					<Route exact path="/code" component={License} />
					<Route exact path="/forgot" component={Forgot} />
					<Route exact path="/reset-password/:id" component={Reset} />
					<ProtectedRoute path="/dashboard" component={DashboardRoutes} />
				</Switch>
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
