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
				centered={centered}
				size={size}
				{...rest}
			>
				<ModalLayout.Header>
					<Title data-testid="modal-title">
						{title} <Close onClick={() => closeModal()} />
					</Title>
				</ModalLayout.Header>
				<ModalLayout.Body>{children}</ModalLayout.Body>
			</ModalLayout>
		</Wrapper>
	);
};
const Title = styled.h4`
	font-weight: 600;
	font-size: 18px;
	line-height: 150%;
	/* or 27px */
	width: 100%;
	color: #151a30;
	svg {
		float: right;
	}
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
Modal.defaultProps = defaultProps;

Modal.propTypes = propTypes;
export default Modal;
