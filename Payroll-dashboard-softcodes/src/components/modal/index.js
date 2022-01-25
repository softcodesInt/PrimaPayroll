/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Modal as ModalLayout } from 'react-bootstrap';

/* --------------------------- Image Dependency -------------------------- */
import { ReactComponent as Close } from '../../assets/icons/close-circle.svg';

/* ----------------------------- Modal propTypes ---------------------------- */
const propTypes = {
	show: PropTypes.bool,
	closeModal: PropTypes.func,
	css: PropTypes.any,
	title: PropTypes.string,
	size: PropTypes.string,
	noAnimation: PropTypes.bool,
	centered: PropTypes.bool,
	children: PropTypes.any,
	description: PropTypes.string,
};

/* --------------------------- Modal defaultProps --------------------------- */
const defaultProps = {
	title: 'Modal',
	centered: false,
	size: '',
	noAnimation: true,
};

const Modal = ({
	show,
	closeModal,
	css,
	title,
	description,
	size,
	noAnimation,
	centered,
	children,
	...rest
}) => {
	return (
		<Wrapper css={css}>
			<ModalLayout
				show={show}
				onHide={closeModal}
				animation={noAnimation}
				scrollable
				centered={centered}
				dialogClassName="slide__up_modal"
				size={size}
				{...rest}
			>
				<ModalLayout.Header>
					<div className="col-sm-6">
						<Title data-testid="modal-title">
							{title} <Close onClick={() => closeModal()} />
						</Title>
						<Description className="lead">{description}</Description>
					</div>
				</ModalLayout.Header>
				<ModalLayout.Body>{children}</ModalLayout.Body>
			</ModalLayout>
		</Wrapper>
	);
};
const Title = styled.h4`
	font-style: normal;
	font-weight: 500;
	font-size: var(--font-h3);
	line-height: 28px;
	letter-spacing: -0.015em;
	margin: 0;
	color: #000000;
	svg {
		float: right;
		cursor: pointer;
		position: fixed;
		right: 53px;
		top: 33px;
		path {
			fill: white;
		}
	}
`;

const Description = styled.h5`
	font-style: normal;
	font-size: 0.8rem;
	font-weight: 300;
	margin: 0;
	color: #000000;
	padding-top: 10px;
`;

const Wrapper = styled.div`
	.modal {
		&-header {
			padding: 0 !important;
			border: none !important;
		}
		&-content {
			padding: 2rem;
			border: none !important;

			box-shadow: none !important;
		}
		&-body {
			padding: 0 !important;
		}
	}
`;

export const ModalWrap = styled.div`
	label {
		font-style: normal;
		font-weight: normal;
		font-size: var(--font-accent);
		line-height: 15px;
		/* identical to box height */

		/* Text/Black */

		color: var(--text-black);
	}
	.radio {
		font-style: normal;
		font-weight: normal;
		font-size: 14px;
		line-height: 18px;
		letter-spacing: 0.02em;
		margin-right: 1rem;
		color: #141515;
	}
`;
Modal.defaultProps = defaultProps;

Modal.propTypes = propTypes;
export default Modal;
