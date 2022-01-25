/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

/* ---------------------------- Image Dependency ---------------------------- */
import { ReactComponent as Loading } from '../../assets/icons/loading.svg';

/* ---------------------------- Loader propTypes ---------------------------- */
const propTypes = {
	loadingText: PropTypes.string,
};

/* --------------------------- Loader defaultProps -------------------------- */
const defaultProps = {
	loadingText: 'Loading ...',
};

const Loader = ({ loadingText }) => {
	return (
		<Wrapper>
			<span>
				<Loading />
				<h3 data-testid="loading-text">{loadingText}</h3>
			</span>
		</Wrapper>
	);
};
const Wrapper = styled.div`
	height: 40vh;
	display: flex;
	align-items: center;
	justify-content: center;
	h3 {
		font-size: 14px;
		text-align: center;
		font-weight: 400;
		text-transform: uppercase;
		color: #a9a9a9;
	}
	svg {
		width: 90px;
		height: 90px;
		margin-bottom: 1rem !important;
		circle {
			stroke: #a9a9a9;
			stroke-width: 3px;
		}
	}
`;

Loader.defaultProps = defaultProps;

Loader.propTypes = propTypes;

export default Loader;
