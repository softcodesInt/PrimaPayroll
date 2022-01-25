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
	height: PropTypes.string,
};

/* --------------------------- Loader defaultProps -------------------------- */
const defaultProps = {
	loadingText: 'Loading ...',
	height: '40vh',
};

const Loader = ({ loadingText, height }) => {
	return (
		<Wrapper height={height}>
			<span>
				<Loading />
				<h3 data-testid="loading-text">{loadingText}</h3>
			</span>
		</Wrapper>
	);
};
const Wrapper = styled.div`
	height: ${(props) => props.height || '40vh'};
	display: flex;
	align-items: center;
	justify-content: center;
	h3 {
		font-size: 14px;
		text-align: center;
		font-weight: 500;
		text-transform: capitalize;
		color: var(--text-gray);
	}
	svg {
		width: 80px;
		height: 80px;
		margin-bottom: 1rem !important;
		circle {
			stroke: #336fe3;
			stroke-width: 1.4px;
		}
	}
`;

Loader.defaultProps = defaultProps;

Loader.propTypes = propTypes;

export default Loader;
