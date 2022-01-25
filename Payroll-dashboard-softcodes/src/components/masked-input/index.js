import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import MaskedInput from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { ErrorText } from 'components/input';

const defaultMaskOptions = {
	prefix: '',
	suffix: '',
	includeThousandsSeparator: true,
	thousandsSeparatorSymbol: ',',
	allowDecimal: true,
	decimalSymbol: '.',
	decimalLimit: 2, // how many digits allowed after the decimal
	integerLimit: 10, // limit length of integer numbers
	allowNegative: false,
	allowLeadingZeroes: false,
};

const CurrencyInput = ({
	maskOptions,
	label,
	isInvalid,
	errorMessage,
	...inputProps
}) => {
	const currencyMask = createNumberMask({
		...defaultMaskOptions,
		...maskOptions,
	});

	return (
		<>
			{label && <Label htmlFor={label}>{label}</Label>}
			<InputContainer
				className="form-control input"
				mask={currencyMask}
				{...inputProps}
			/>
			{isInvalid && <ErrorText>{errorMessage}</ErrorText>}
		</>
	);
};

CurrencyInput.defaultProps = {
	inputMode: 'numeric',
	maskOptions: {},
};

CurrencyInput.propTypes = {
	inputmode: PropTypes.string,
	maskOptions: PropTypes.shape({
		prefix: PropTypes.string,
		suffix: PropTypes.string,
		includeThousandsSeparator: PropTypes.bool,
		thousandsSeparatorSymbol: PropTypes.string,
		allowDecimal: PropTypes.bool,
		decimalSymbol: PropTypes.string,
		decimalLimit: PropTypes.string,
		requireDecimal: PropTypes.bool,
		allowNegative: PropTypes.bool,
		allowLeadingZeroes: PropTypes.bool,
		integerLimit: PropTypes.number,
	}),
};

const Label = styled.label`
	font-weight: 500;
	font-size: 14px;
	line-height: 150%;
	/* identical to box height, or 21px */

	color: #151a30;
`;

const InputContainer = styled(MaskedInput)`
	margin-bottom: 1.5rem;
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
`;

export default CurrencyInput;
