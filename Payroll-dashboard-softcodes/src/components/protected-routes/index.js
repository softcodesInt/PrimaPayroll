import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';

import isAuthenticated from '../../utils/is-authenticated';

const ProtectedRoute = ({
	component: ProtectedComponent,
	location,
	...rest
}) => {
	return (
		<Route
			{...rest}
			render={(props) =>
				isAuthenticated() ? (
					<ProtectedComponent {...props} />
				) : (
					<Redirect to="/" />
				)
			}
		/>
	);
};

ProtectedRoute.propTypes = {
	component: PropTypes.func.isRequired,
	location: PropTypes.any,
	isAuthenticated: PropTypes.func,
};

export default ProtectedRoute;
