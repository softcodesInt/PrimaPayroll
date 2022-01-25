/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

/* ---------------------------- Image Dependency ---------------------------- */
import Arrow from 'assets/icons/icon-arrow-down.svg';

/* ----------------------------- AutoCompleteInput PropTypes ---------------------------- */
const propTypes = {
	type: PropTypes.string,
	id: PropTypes.string,
	errorMessage: PropTypes.string,
	placeholder: PropTypes.string,
	hasStrip: PropTypes.bool,
	activeClassName: PropTypes.string,
	label: PropTypes.string,
	isInvalid: PropTypes.bool,
	icon: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

/* --------------------------- AutoCompleteInput defaultProps --------------------------- */
const defaultProps = {
	type: 'input',
	id: 0,
	placeholder: 'input',
	errorMessage: 'This field is required',
	hasStrip: null,
	label: 'Label',
	isInvalid: null,
	value: '',
};

const AutoCompleteInput = ({
	id,
	type,
	placeholder,
	hasStrip,
	label,
	icon,
	activeClassName,
	background = '#f8f8f9',
	isInvalid,
	children,
	errorMessage,
	value,
	...rest
}) => {
	return (
		<AutoCompleteInputContainer
			hasStrip={hasStrip}
			isInvalid={isInvalid}
			touched={value !== ''}
			icon={icon}
			background={background}
			disabled={rest?.disabled}
			data-testid="input"
		>
			{label && <label htmlFor={label}>{label}</label>}
			<input
				// eslint-disable-next-line react/jsx-props-no-spreading
				{...rest}
				type={type}
				id={id}
				value={value}
				autoComplete="new----autocomplete"
				className={`auto__input form-control ${
					activeClassName ? 'active' : ''
				}`}
				placeholder={placeholder}
				data-testid="inputs"
			/>
			<Autocomplete className="auto__complete">{children}</Autocomplete>
			{isInvalid && <ErrorText>{errorMessage}</ErrorText>}
		</AutoCompleteInputContainer>
	);
};

export const ErrorText = ({ children }) => {
	return (
		<Text color="#f66262" fontSize="12px" className="error">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
			>
				<path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1 6h2v8h-2v-8zm1 12.25c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z" />
			</svg>
			{children}
		</Text>
	);
};
const Autocomplete = styled.div`
	max-height: 200px;
	/* border: 1px solid red; */
	width: 96%;
	display: none;
	z-index: 99;
	position: absolute;
	background: #ffffff;
	border: 0.5px solid rgba(0, 0, 0, 0.2);
	box-sizing: border-box;
	box-shadow: 4px 4px 30px -11px rgba(123, 133, 137, 0.15);
	border-radius: 4px;
	overflow: scroll;
	padding: 15px;
	svg {
		width: 40px;
		height: auto;

		circle {
			stroke: #17558e;
		}
	}
	.button {
		background: white;
		width: 100%;
		display: block;
		text-align: left;
		padding: 17px;
		border: none;
		border-bottom: 2px solid #f1f1f1;
		p {
			margin: 0;
			font-size: 16px;
			font-weight: 500;
			color: var(--text-black);
		}
	}
	&:focus,
	&:visited,
	&:active,
	&:hover {
		display: block;
	}
`;
const AutoCompleteInputContainer = styled.div`
	margin-bottom: 1.5rem;
	.auto__input:focus + .auto__complete {
		display: block;
	}
	input {
		border: none;
		box-sizing: border-box;
		background: #f8f8f9;
		border-radius: 8px;
		box-sizing: border-box;
		font-style: normal;
		font-family: var(--font-primary);
		font-weight: normal;

		font-size: var(--font-p);
		line-height: 18px;
		letter-spacing: 0.01em;
		/* identical to box height */

		padding: 1.4rem 1.3rem;
		box-shadow: none;
		line-height: 150%;
		/* identical to box height, or 24px */

		color: #8f9bb3;
		background-image: url(${Arrow});

		background-position: 96% center;
		background-repeat: no-repeat;

		&:focus {
			border: 1px solid var(--primary-blue) !important;
			box-shadow: none !important;
		}
		&.active {
			color: #237cce !important;
			font-weight: 900 !important;
		}
	}
	label {
		font-weight: normal;

		font-size: var(--font-accent);
		line-height: 15px;
		/* identical to box height */

		letter-spacing: 0.02em;

		color: var(--text-black);
	}
	button {
		&.input-icon {
			height: 43.5px;
			z-index: 12;
			width: 34px;
			align-items: center;
			justify-content: center;
			display: flex;
			margin-right: 2px;
			float: right;
			cursor: pointer;
			background: #f8f8f9;
			border: none;
			border-radius: 6px;
			margin-top: -2.8rem;

			&.active__showpassword {
				svg path {
					fill: var(--primary-blue);
				}
			}
		}

		&.error {
			color: red;
			font-size: 12px;
			margin-top: 3px;
			display: block;
		}
	}
`;

const Text = styled.span`
	svg {
		border-radius: 4px;
		width: 18px;
		background: #f76e6d33;
		padding: 4px 1px;
		height: 18px;
		fill: #fb6363;

		margin-top: 0px;
		margin-right: 6px;
	}
	color: ${(props) => props.color};
	font-size: ${(props) => props.fontSize};
`;

AutoCompleteInput.defaultProps = defaultProps;

AutoCompleteInput.propTypes = propTypes;

export default AutoCompleteInput;
