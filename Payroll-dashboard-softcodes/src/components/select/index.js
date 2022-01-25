/* -------------------------------------------------------------------------- */
/*                           External Depenedencies                           */
/* -------------------------------------------------------------------------- */
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.css';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Button from 'react-bootstrap/Button';
import ReactSelect from 'react-select';

/* ---------------------------- Image Dependency ---------------------------- */
import { ReactComponent as ArrowDown } from 'assets/icons/icon-arrow-down.svg';
import { ReactComponent as Selection } from 'assets/icons/icon-selection.svg';

/* ---------------------------- Select propTypes ---------------------------- */
const propTypes = {
	id: PropTypes.string,
	errorMessage: PropTypes.string,
	hasStrip: PropTypes.bool,
	label: PropTypes.string,
	isInvalid: PropTypes.bool,
	children: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
	value: PropTypes.string,
};

/* --------------------------- Select defaultProps -------------------------- */
const defaultProps = {
	id: 'input',
	errorMessage: 'This field is required',
	hasStrip: null,
	label: 'Label',
	isInvalid: null,
	value: '',
};

const Select = ({
	id,
	hasStrip,
	label,
	children,
	isInvalid,
	errorMessage,
	value,
	showTooltip,
	tooltipTitle,
	tooltipContent,
	...rest
}) => {
	return (
		<SelectContainer
			hasStrip={hasStrip}
			isInvalid={isInvalid}
			touched={value !== ''}
			disabled={rest?.disabled}
			data-testid="select"
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
			<select
				// eslint-disable-next-line react/jsx-props-no-spreading
				{...rest}
				id={id}
				value={value}
				className="form-control"
			>
				{children}
			</select>
			{rest?.multiple ? <Selection /> : <ArrowDown />}
			{isInvalid && (
				<Text color="#f66262" fontSize="12px" className="error">
					{errorMessage}
				</Text>
			)}
		</SelectContainer>
	);
};

export const MultiSelect = ({
	id,
	hasStrip,
	label,
	options,
	isInvalid,
	errorMessage,
	value,
	onChange,
	placeholder,
	name,
	isMulti = true,
	...rest
}) => {
	return (
		<>
			{label && <Label htmlFor={label}>{label}</Label>}
			<ReactSelect
				cacheOptions
				isMulti={isMulti}
				id={name}
				name={name}
				options={options}
				onChange={onChange}
				placeholder={placeholder}
				value={value}
			/>
		</>
	);
};

const SelectContainer = styled.div`
	margin-bottom: 1.5rem;

	select {
		border: 1px solid #bbc0c4;
		box-sizing: border-box;
		font-family: var(--font-primary);
		box-sizing: border-box;
		font-style: normal;
		font-weight: normal;
		font-size: var(--font-p);
		/* identical to box height */

		padding: 0rem 1rem;
		box-shadow: none;
		line-height: 150%;
		min-height: 43px;
		-webkit-appearance: none;
		/* identical to box height, or 24px */

		color: var(--text-black);

		${(props) => (props.touched ? `box-shadow: none !important;` : ``)}
		&:focus {
			border: 1px solid var(--theme-primary) !important;
			box-shadow: none !important;
			background: #f8f8f9;
		}
	}
	svg {
		position: absolute;
		right: 28px;
		margin-top: -1.5rem;
	}
	label {
		font-weight: 500;
		font-size: 14px;
		line-height: 150%;
		/* identical to box height, or 21px */

		color: #151a30;
	}
`;

const Label = styled.label`
	font-weight: 500;
	font-size: 14px;
	line-height: 150%;
	/* identical to box height, or 21px */

	color: #151a30;
`;

const Text = styled.span`
	color: ${(props) => props.color};
	font-size: ${(props) => props.fontSize};
`;

Select.defaultProps = defaultProps;

Select.propTypes = propTypes;

export default Select;
