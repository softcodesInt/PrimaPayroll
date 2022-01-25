/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import 'bootstrap/dist/css/bootstrap.css';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';

/* ---------------------------- Image Dependency ---------------------------- */
import { ReactComponent as Eye } from 'assets/icons/eye.svg';

/* ----------------------------- Input PropTypes ---------------------------- */
const propTypes = {
	type: PropTypes.string,
	id: PropTypes.string,
	errorMessage: PropTypes.string,
	placeholder: PropTypes.string,
	hasStrip: PropTypes.bool,
	inputClassName: PropTypes.string,
	label: PropTypes.string,
	isInvalid: PropTypes.bool,
	icon: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	required: PropTypes.bool,
};

/* --------------------------- Input defaultProps --------------------------- */
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

const Input = ({
	id,
	type,
	placeholder,
	hasStrip,
	label,
	icon,
	inputClassName,
	background = '#f8f8f9',
	isInvalid,
	errorMessage,
	value,
	required,
	showTooltip,
	tooltipTitle,
	tooltipContent,
	...rest
}) => {
	const [showPassword, onShowPassword] = useState('password');

	return (
		<InputContainer
			hasStrip={hasStrip}
			isInvalid={isInvalid}
			touched={value !== ''}
			icon={icon}
			background={background}
			disabled={rest?.disabled}
			data-testid="input"
		>
			{label && <label htmlFor={label}>{label}</label>}
			{showTooltip && (
				<OverlayTrigger
					placement="top"
					trigger="click"
					overlay={
						<Popover>
							<Popover.Title as="h3">{tooltipTitle}</Popover.Title>
							<Popover.Content>{tooltipContent}</Popover.Content>
						</Popover>
					}
				>
					<Button variant="light">&#9432;</Button>
				</OverlayTrigger>
			)}
			<input
				// eslint-disable-next-line react/jsx-props-no-spreading
				{...rest}
				type={type === 'password' ? showPassword : type}
				id={id}
				value={value}
				className={`form-control ${inputClassName}`}
				placeholder={placeholder}
				data-testid="inputs"
				required={required}
			/>

			{type === 'password' && (
				<button
					onClick={() =>
						onShowPassword(
							`${showPassword === 'password' ? 'input' : 'password'}`
						)
					}
					className={`input-icon ${
						showPassword === 'input' ? 'active__showpassword' : ''
					}`}
					type="button"
				>
					<Eye />
				</button>
			)}
			{isInvalid && <ErrorText>{errorMessage}</ErrorText>}
		</InputContainer>
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

const InputContainer = styled.div`
	margin-bottom: 1.5rem;

	input {
		border: 1px solid #bbc0c4;
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

		color: var(--text-black);
		${(props) =>
			props.icon
				? css`
						background-image: url(${props.icon});

						background-position: 13px center;
						background-repeat: no-repeat;
						padding-left: 2.4rem;
				  `
				: ``}
		${(props) => (props.touched ? `box-shadow: none !important;` : ``)}
		&:focus {
			border: 1px solid var(--primary-blue) !important;
			box-shadow: none !important;
		}
	}
	label {
		font-weight: 500;
		font-size: 14px;
		line-height: 150%;
		/* identical to box height, or 21px */

		color: #151a30;
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

Input.defaultProps = defaultProps;

Input.propTypes = propTypes;

export default Input;
