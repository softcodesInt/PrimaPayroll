/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

/* ----------------------------- Image Dependency ---------------------------- */
import { ReactComponent as Loading } from '../../assets/icons/loading.svg';

/* ---------------------------- Button PropTypes ---------------------------- */
const proptypes = {
	css: PropTypes.object,
	type: PropTypes.string,
	disabled: PropTypes.bool,
	isLoading: PropTypes.bool,
	showSpinner: PropTypes.bool,
	className: PropTypes.string,
	width: PropTypes.any,
	children: PropTypes.any,
	icon: PropTypes.element,
	loadingText: PropTypes.string,
};

/* --------------------------- Button defaultProps -------------------------- */
const defaultprops = {
	isLoading: false,
	showSpinner: true,
	type: 'submit',
	loadingText: 'Loading...',
	css: null,
	className: '',
	icon: null,
	width: '',
	disabled: false,
	children: [],
};

const Button = ({
	width,
	children,
	isLoading,
	loadingText,
	disabled,
	// eslint-disable-next-line no-shadow
	css: cssStyle,
	type,
	className,
	icon,
	...rest
}) => {
	return (
		<ButtonSkelenton
			width={width}
			className={['button', className].join(' ')}
			disabled={disabled || isLoading}
			css={cssStyle}
			type={type}
			data-testid="button"
			icon={icon}
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...rest}
		>
			{isLoading ? (
				<>
					{rest?.showSpinner && <Loading />}
					{/* {loadingText} */}
				</>
			) : (
				<>
					{icon} {children}{' '}
				</>
			)}
		</ButtonSkelenton>
	);
};

const generateSize = (size, fontSize, icon) => {
	if (size === 'small')
		return css`
			padding: ${!icon ? '0.585rem 1.9rem' : '0.585rem 1rem'};
			font-size: ${fontSize || '14px'};
		`;
	if (size === 'large')
		return css`
			padding: 1.15rem 4.9rem;
			font-size: ${fontSize || '16px'};
		`;
	return css`
		padding: ${!icon ? '0.785rem 2.6rem' : '0.785rem 1.9rem'};
		font-size: ${fontSize || '14px'};
	`;
};

const ButtonSkelenton = styled.button`
	font-style: normal;

	font-weight: 500;

	line-height: 18px;
	letter-spacing: 0.02em;
	font-size: var(--font-p);

	font-family: var(--font-primary);
	border-radius: 6px;
	text-align: center;
	display: block;
	color: #ffffff;

	${(props) => (props.width ? `width: ${props.width}` : '')};
	${(props) => generateSize(props.size, null, props.icon)};
	${(props) =>
		props.icon
			? css`
					svg {
						width: 14px !important;
						margin-right: 0.3rem;
						height: auto !important;
					}
			  `
			: ''}
	&:hover {
		transition: all 0.25s ease-in;
		cursor: pointer;
		opacity: 0.8;
	}

	&:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	${css`
		${(props) => props.css};
	`};

	svg {
		background: rgba(255, 255, 255, 0);
		height: 44px;
		width: 37px;
		display: inline-block !important;
		margin-top: -23px !important;
		transform: translate(0, 11px);
	}
`;

Button.defaultProps = defaultprops;
Button.propTypes = proptypes;

export default Button;
