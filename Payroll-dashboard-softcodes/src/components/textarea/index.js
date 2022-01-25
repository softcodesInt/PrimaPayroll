/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

/* ----------------------------- TextArea PropTypes ---------------------------- */
const propTypes = {
	id: PropTypes.string,
	errorMessage: PropTypes.string,
	placeholder: PropTypes.string,
	hasStrip: PropTypes.bool,
	inputClassName: PropTypes.string,
	label: PropTypes.string,
	isInvalid: PropTypes.bool,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

/* --------------------------- TextArea defaultProps --------------------------- */
const defaultProps = {
	id: 0,
	placeholder: 'input',
	errorMessage: 'This field is required',
	hasStrip: null,
	label: 'Label',
	row: '8',
	cols: '11',
	size: '120px',
	resize: 'none',
	isInvalid: null,
	value: '',
};

const TextArea = ({
	id,
	type,
	placeholder,
	hasStrip,
	label,
	row,
	size,
	resize,
	cols,
	textareaClassName,
	isInvalid,
	errorMessage,
	value,
	...rest
}) => {
	return (
		<TextAreaContainer
			hasStrip={hasStrip}
			isInvalid={isInvalid}
			touched={value !== ''}
			size={size}
			resize={resize}
			disabled={rest?.disabled}
			data-testid="textarea"
		>
			{label && <label htmlFor={label}>{label}</label>}
			<textarea
				// eslint-disable-next-line react/jsx-props-no-spreading
				{...rest}
				row={row}
				cos={cols}
				id={id}
				value={value}
				className={`form-control ${textareaClassName}`}
				placeholder={placeholder}
				data-testid="textareas"
			/>

			{isInvalid && <ErrorText>{errorMessage}</ErrorText>}
		</TextAreaContainer>
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

const TextAreaContainer = styled.div`
	margin-bottom: 1.5rem;

	textarea {
		border: 1px solid #bbc0c4;
		box-sizing: border-box;
		box-sizing: border-box;
		font-style: normal;
		font-family: var(--font-primary);
		font-weight: normal;
		resize: ${(props) => props?.resize};
		font-size: var(--font-p);
		line-height: 18px;
		letter-spacing: 0.01em;
		/* identical to box height */

		height: ${(props) => props.size};
		padding: 1.4rem 1.3rem;
		box-shadow: none;
		line-height: 150%;
		/* identical to box height, or 24px */

		color: var(--text-black);

		${(props) => (props.touched ? `box-shadow: none !important;` : ``)}
		&:focus {
			border: 1px solid var(--primary-blue) !important;
			box-shadow: none !important;
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

TextArea.defaultProps = defaultProps;

TextArea.propTypes = propTypes;

export default TextArea;
