/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Alert } from 'react-bootstrap';
import { createStructuredSelector } from 'reselect';

/* -------------------------- Internal Dependencies ------------------------- */
import { selectAlertItems } from '../../redux/alert/selector';
import { removeAlert } from '../../redux/alert/actions';

/* --------------------------- Image Dependencies --------------------------- */
import { ReactComponent as ErrorComponent } from 'assets/icons/error.svg';
import { ReactComponent as SuccessComponent } from 'assets/icons/success.svg';

/* ---------------------------- Alerts PropTypes ---------------------------- */
const proptypes = {
	alerts: PropTypes.array,
	removeAlert: PropTypes.func,
};

const Alerts = ({ alerts, removeAlert: removeAlertById }) => (
	<AlertContainer data-testid="alerts">
		{alerts !== null &&
			alerts?.length > 0 &&
			alerts?.map((alert) => (
				<Alert
					variant={`${alert?.alertType === 'error' ? 'danger' : 'success'}`}
					key={alert?.id}
				>
					<button onClick={() => removeAlertById?.(alert?.id)} type="button">
						&#10005;
					</button>
					<p className="alert--flex d-flex align-items-center">
						{alert.alertType === 'success' ? (
							<SuccessComponent />
						) : (
							<ErrorComponent />
						)}
						<span>{alert.msg} </span>
					</p>
				</Alert>
			))}
	</AlertContainer>
);

const AlertContainer = styled(Alert)`
	position: fixed;
	top: 1px;
	z-index: 999999;
	width: 340px;
	right: 4px;
	word-break: break-word;
	animation: fadeIn;
	animation-duration: 1s;
	animation-iteration-count: 1;

	@keyframes fadeIn {
		0% {
			opacity: 0.2;
			-webkit-transform: translateX(100%);
			transform: translateX(100%);
		}
		100% {
			opacity: 1;
			-webkit-transform: translateX(0%);
			transform: translateX(0%);
		}
	}
	span {
		&:first-letter {
			text-transform: uppercase;
		}
		text-transform: lowercase;
	}
	.h4 {
		font-size: 20px;
		font-family: blorado;
		text-transform: capitalize;
		font-weight: 800;
		color: #fff;
		margin: 0 0 8px;
	}

	button {
		position: absolute;
		right: 16px;
		border: none;
		background: transparent;
		font-size: 16px;
		color: #fff;
		cursor: pointer;
		z-index: 9999;
	}
	p {
		font-size: 14px;
		color: #fff;
		margin: 0;
		font-family: 'DM Sans';
	}

	.alert-success {
		width: 100%;
		padding: 10px 37px 11px 51px;
		background: #ffffffdb;
		box-shadow: 5px 4px 30px -7px rgba(108, 116, 123, 0.2);
		border-radius: 10px;
		backdrop-filter: blur(8px) saturate(2.5);
		border: 1px solid #eff6fb;

		margin-left: auto;
		svg {
			width: 25px;
			height: 25px;
			padding: 4px;
			background: #deecf9;
			border-radius: 50%;
			margin-right: 8px;
			fill: #2e6faf;
			position: absolute;
			left: 13px;
		}
		p {
			color: #2e6faf;
		}
		button {
			color: #2e6faf;
		}
	}
	.alert-danger {
		width: 100%;
		padding: 10px 37px 11px 51px;
		background: #da4a3fdb;
		border-radius: 10px;
		border: none;
		margin-left: auto;
		backdrop-filter: blur(10px) saturate(3.5);
		svg {
			width: 25px;
			height: 25px;
			padding: 4px;
			background: #f37d74;
			border-radius: 50%;
			margin-right: 8px;
			fill: #fdc2c2;
			position: absolute;
			left: 13px;
		}
	}
`;

const mapStateToProps = createStructuredSelector({
	alerts: selectAlertItems,
});

const mapDispatchToProps = (dispatch) => ({
	removeAlert: (id) => dispatch(removeAlert(id)),
});

Alerts.propTypes = proptypes;

export default connect(mapStateToProps, mapDispatchToProps)(Alerts);
