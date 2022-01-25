/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

/* --------------------------- Internal Dependency -------------------------- */
import SidebarLayout from './sidebar';
import NavLayout from './navbar';

/* ------------------------ DashbaordLayout propTypes ----------------------- */
const propTypes = {
	children: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
};

/* ---------------------- DashbaordLayout defaultProps ---------------------- */
const defaultProps = {
	children: <></>,
};

const DashbaordLayout = ({ children }) => {
	return (
		<>
			<SidebarLayout />
			<NavLayout />
			<Main>{children}</Main>
		</>
	);
};

const Main = styled.main`
	float: right;
	-webkit-transition: all 0.4s ease-in-out;
	transition: all 0.4s ease-in-out;
	width: calc(100% - 210px);
	display: block;
	background: #f0f4f7;
	padding: 4.5rem 0 0;
	min-height: 100vh;
`;

DashbaordLayout.defaultProps = defaultProps;

DashbaordLayout.propTypes = propTypes;

export default DashbaordLayout;
