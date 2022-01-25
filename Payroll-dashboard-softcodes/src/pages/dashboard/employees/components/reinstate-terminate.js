import Modal, { ModalWrap } from 'components/modal';
import React, { useState } from 'react';
import API from 'services/api';
import PropTypes from 'prop-types';
import Select from 'components/select';
import Input from 'components/input';
import { token } from 'utils/user_persist';
import Button from 'components/button';

const propTypes = {
	displayModal: PropTypes.bool,
	closeModal: PropTypes.func,
	displayTitle: PropTypes.oneOf(['terminate', 'reinstate']),
	userId: PropTypes.string,
};

export const ReinstateTerminate = ({
	displayModal,
	closeModal,
	displayTitle,
	userId,
	choices,
}) => {
	const [appState, setAppState] = useState({
		reason: '',
		date: '',
		error: '',
		submitState: 'rest',
	});

	const handleChange = (e) => {
		const { value: reason } = e.target;
		setAppState((state) => ({
			...state,
			reason,
			error: !reason?.length ? `Reason for ${displayTitle} is required` : '',
		}));
	};

	const handleDateChange = (e) => {
		const { value: date } = e.target;
		setAppState((state) => ({
			...state,
			date,
			error: !date?.length ? `Date for ${displayTitle} is required` : '',
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (appState.error?.length) {
			return;
		}
		setAppState((state) => ({ ...state, submitState: 'loading' }));
		const options = API.options('POST', token, {
			data: {
				reason: appState.reason,
				date: appState.date,
			},
		});
		await API.request(`/employees/employee/${userId}/terminate/`, options);
		setAppState((state) => ({ ...state, submitState: 'rest' }));
		closeModal();
	};

	return (
		<>
			<Modal
				show={displayModal}
				closeModal={closeModal}
				title={`${displayTitle} Employee`}
				className="text-capitalize"
			>
				<ModalWrap className="row mr-0">
					<form className="col-md-9" onSubmit={handleSubmit}>
						<div className="row">
							<div className="col-md-6">
								<Select
									hasStrip
									id="reason"
									name="reason"
									label={`Reason for ${displayTitle}`}
									value={appState.reason}
									onChange={handleChange}
									errorMessage={appState.error}
								>
									<option>--Choose a reason--</option>
									{choices.results.map((r) => (
										<option value={r.id}>{r.name}</option>
									))}
								</Select>
							</div>
							<div className="col-md-6">
								<Input
									hasStrip
									id="date"
									name="date"
									type="date"
									format="yyyy-mm-dd"
									label="When did it happen?*"
									placeholder="yyyy-mm-dd"
									value={appState.date}
									onChange={handleDateChange}
									errorMessage={appState.error}
								/>
							</div>
							<Button
								type="submit"
								className="btn-soft mr-auto mt-4"
								isLoading={appState.submitState === 'loading'}
								disabled={appState.submitState === 'loading'}
							>
								Submit
							</Button>
						</div>
					</form>
				</ModalWrap>
			</Modal>
		</>
	);
};

ReinstateTerminate.propTypes = propTypes;
