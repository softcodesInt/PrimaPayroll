/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { ErrorText } from 'components/input';

/* ----------------------------- CheckBox propTypes ---------------------------- */
const propTypes = {
	id: PropTypes.string,
	errorMessage: PropTypes.string,
	hasStrip: PropTypes.bool,
	isInvalid: PropTypes.bool,
	css: PropTypes.object,
	name: PropTypes.string,
	value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	children: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
	activeColor: PropTypes.string,
	checked: PropTypes.bool,
};

const CheckBox = ({
	id,
	children,
	hasStrip,
	css: cssStyle,
	activeColor,
	checked,
	name,
	value,
	isInvalid,
	errorMessage,

	...rest
}) => {
	return (
		<Wrapper css={cssStyle} activeColor={activeColor} disabled={rest.disabled}>
			<Label>
				<span>{children}</span>
				<input
					type="checkbox"
					checked={checked}
					name={name}
					value={value}
					onChange={onchange}
					{...rest}
					data-testid="CheckBox"
				/>
				<span className="checkmark" />
			</Label>
			{isInvalid && <ErrorText>{errorMessage}</ErrorText>}
		</Wrapper>
	);
};
const Wrapper = styled.div`
	input {
		position: absolute;
		opacity: 0;
		cursor: pointer;
	}
	${(props) =>
		props.disabled &&
		css`
			opacity: 0.4;
			cursor: not-allowed;
			input {
				cursor: not-allowed;
			}
		`}
	.checkmark {
		position: absolute;
		top: 0;
		left: 0;
		height: 20px;
		width: 20px;
		border: 2px solid
			${(props) =>
				props.activeColor ? props.activeColor : ' var(--primary-blue)'};
		background-color: transparent;
		border-radius: 5px;
		background: ${(props) => (props.disabled ? 'var(--primary-blue)' : '')};
	}

	input:checked ~ .checkmark {
		background-color: var(--primary-blue);
	}

	.checkmark:after {
		content: '';
		position: absolute;
		display: none;
	}

	input:checked ~ .checkmark:after {
		display: block;
	}

	.checkmark:after {
		left: 6px;
		top: 2px;
		width: 5px;
		height: 10px;
		border: solid white;
		border-radius: 5px;
		border-width: 0 3px 3px 0;
		-webkit-transform: rotate(45deg);
		-ms-transform: rotate(45deg);
		transform: rotate(45deg);
		background: ${(props) =>
			props.activeColor ? props.activeColor : ' var(--primary-blue)'};
	}
	${css`
		${(props) => props.css};
	`};
`;

const Label = styled.label`
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	display: block;
	position: relative;
	padding-left: 35px;
	margin-bottom: 12px;
	cursor: pointer;
	&:hover input ~ .checkmark {
		background-color: #ccc;
	}
`;

CheckBox.propTypes = propTypes;

export default CheckBox;
