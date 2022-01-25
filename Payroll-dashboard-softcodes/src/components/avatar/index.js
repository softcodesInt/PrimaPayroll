/* -------------------------------------------------------------------------- */
/*                           External Depenedencies                           */
/* -------------------------------------------------------------------------- */
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

/* -------------------------- Internal Dependencies ------------------------- */
import { getAvatar } from 'utils';

/* ---------------------------- Avatar PropTypes ---------------------------- */
const proptypes = {
	data: PropTypes.object,
	isTile: PropTypes.bool,
};

const Avatar = ({
	data,
	isTile = false,
	size = !isTile ? '2.62em' : 40,
	...rest
}) => {
	return (
		<>
			{!isTile ? (
				<Wrapper
					style={{
						background: getAvatar(data?.first_name),
					}}
					size={size}
					{...rest}
				>
					{data?.first_name.split('')[0]}
					{data?.last_name.split('')[0]}
				</Wrapper>
			) : (
				<TileWrapper
					style={{
						background: getAvatar(data, isTile),
					}}
					size={size}
					{...rest}
				>
					{data.split('')[0]}
				</TileWrapper>
			)}
		</>
	);
};

const Wrapper = styled.span`
	width: ${(props) => props.size};
	height: ${(props) => props.size};
	color: #ffffff !important;
	background: #4867f7;
	text-transform: uppercase;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	margin-right: 6px;
	margin-left: 10px;
	font-size: 0.9em;
	font-weight: 600;
`;
const TileWrapper = styled.div`
	width: ${(props) => props.size}px;
	height: ${(props) => props.size}px;
	color: #ffffff !important;
	background: #4867f7;
	text-transform: uppercase;
	display: flex;

	align-items: center;
	justify-content: center;
	border-radius: 8px;

	margin-right: 9px;
	margin-left: 10px;
	font-size: 1.1em;

	font-weight: 600;
`;
Avatar.propTypes = proptypes;
export default Avatar;
