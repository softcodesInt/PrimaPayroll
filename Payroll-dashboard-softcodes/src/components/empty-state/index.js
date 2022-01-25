/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

/* ---------------------------- Image Dependency ---------------------------- */
import { ReactComponent as EmptyStateImage } from '../../assets/icons/empty-state.svg';

/* -------------------------- EmptyState PropTypes -------------------------- */
const propTypes = {
	text: PropTypes.string,
	children: PropTypes.any,
};

/* ------------------------ EmptyState Default Props ------------------------ */
const defaultProps = {
	text: 'Nothing here yet',
	children: [],
};

const EmptyState = ({ text, children, ...rest }) => {
	return (
		<Wrapper {...rest}>
			<span>
				<EmptyStateImage />
				<H3 data-testid="empty-state">{text}</H3>
				<>{children}</>
			</span>
		</Wrapper>
	);
};

const Wrapper = styled.main`
	text-align: center;
	height: 100vh;
	display: flex;
	justify-content: center;
	text-align: center;
	height: 57vh;
	align-items: center;
`;

const H3 = styled.h3`
	font-style: normal;
	font-weight: 400;
	font-size: 16px;
	line-height: 19px;
	text-align: center;
	color: #151a30;
`;

EmptyState.defaultProps = defaultProps;

EmptyState.propTypes = propTypes;

export default EmptyState;
