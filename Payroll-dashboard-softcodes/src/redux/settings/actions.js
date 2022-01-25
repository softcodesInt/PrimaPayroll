/* -------------------------- Internal Dependencies ------------------------- */

import { setAlert } from 'redux/alert/actions';
import API from 'services/api';
import { getError } from 'utils';
import { token } from 'utils/user_persist';
import SettingsStructure from './types';

/**
 * @namespace dispatch
 */

/**
 * Activate License
 * @function
 * @param {Object} data
 * @returns {Function}
 */
export const addBank = (data) => {
	return async (dispatch) => {
		dispatch({
			type: SettingsStructure.ADD_BANK,
			payload: {
				loading: true,
			},
		});
		const options = API.options('POST', token, { data });

		try {
			await API.request('/utilities/bank-list/', options);

			dispatch({
				type: SettingsStructure.ADD_BANK,
				payload: {
					loading: false,
				},
			});

			dispatch(getAllBanks());

			return dispatch(setAlert(`Bank added successfully.`, 'success'));
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: SettingsStructure.ADD_BANK,
				payload: {
					loading: false,
				},
			});
			throw err;
		}
	};
};

/**
 * Activate License
 * @function
 * @param {Object} data
 * @returns {Function}
 */
export const editBank = (id, data) => {
	return async (dispatch) => {
		dispatch({
			type: SettingsStructure.EDIT_BANK,
			payload: {
				loading: true,
			},
		});

		const options = API.options('PATCH', token, { data });

		try {
			await API.request(`/utilities/bank-list/${id}/`, options);

			dispatch({
				type: SettingsStructure.EDIT_BANK,
				payload: {
					loading: false,
				},
			});

			dispatch(getAllBanks());

			dispatch(setAlert(`Bank updated successfully.`, 'success'));
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: SettingsStructure.EDIT_BANK,
				payload: {
					loading: false,
				},
			});
			throw err;
		}
	};
};

/**
 * @function
 * @param { user_id } Id // Get userId from state
 */
export const getAllBanks = (queryParam) => {
	return async (dispatch) => {
		dispatch({
			type: SettingsStructure.GET_BANKS,
			payload: { loading: true },
		});
		const options = API.options('GET', token, {});
		try {
			const response = await API.request(
				`/utilities/bank-list?${queryParam}`,
				options
			);

			await dispatch({
				type: SettingsStructure.GET_BANKS,
				payload: {
					loading: false,
					data: {
						...response.data,
					},
				},
			});

			return response.data;
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: SettingsStructure.GET_BANKS,
				payload: { loading: false },
			});
		}
	};
};

/**
 * @function
 * @param { user_id } Id // Get userId from state
 */
export const deactivateBank = (Id) => {
	return async (dispatch) => {
		dispatch({
			type: SettingsStructure.DEACTIVATE_BANK,
			payload: { loading: true },
		});
		const options = API.options('DELETE', token, {});
		try {
			await API.request(`/utilities/bank-list/${Id}/`, options);

			await dispatch({
				type: SettingsStructure.DEACTIVATE_BANK,
				payload: { loading: false },
			});
			await dispatch(getAllBanks());

			return dispatch(setAlert(`Bank deactivated successfully`, 'success'));
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: SettingsStructure.DEACTIVATE_BANK,
				payload: { loading: false },
			});
		}
	};
};

export const addJobTitle = (data) => {
	return async (dispatch) => {
		dispatch({
			type: SettingsStructure.ADD_JOB_TITLE,
			payload: {
				loading: true,
			},
		});
		const options = API.options('POST', token, { data });

		try {
			await API.request('/utilities/job-title/', options);

			dispatch({
				type: SettingsStructure.ADD_JOB_TITLE,
				payload: {
					loading: false,
				},
			});

			dispatch(getAllJobTitles());

			return dispatch(setAlert(`Job title added successfully.`, 'success'));
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: SettingsStructure.ADD_JOB_TITLE,
				payload: {
					loading: false,
				},
			});
			throw err;
		}
	};
};

/**
 * Activate License
 * @function
 * @param {Object} data
 * @returns {Function}
 */
export const editJobTitle = (id, data) => {
	return async (dispatch) => {
		dispatch({
			type: SettingsStructure.EDIT_JOB_TITLE,
			payload: {
				loading: true,
			},
		});

		const options = API.options('PATCH', token, { data });

		try {
			await API.request(`/utilities/job-title/${id}/`, options);

			dispatch({
				type: SettingsStructure.EDIT_JOB_TITLE,
				payload: {
					loading: false,
				},
			});
			dispatch(getAllJobTitles());
			dispatch(setAlert(`Job title updated successfully.`, 'success'));
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: SettingsStructure.EDIT_JOB_TITLE,
				payload: {
					loading: false,
				},
			});
			throw err;
		}
	};
};

/**
 * @function
 * @param { user_id } Id // Get userId from state
 */
export const getAllJobTitles = (queryParam) => {
	return async (dispatch) => {
		dispatch({
			type: SettingsStructure.GET_JOB_TITLES,
			payload: { loading: true },
		});
		const options = API.options('GET', token, {});
		try {
			const response = await API.request(
				`/utilities/job-title?${queryParam}`,
				options
			);

			await dispatch({
				type: SettingsStructure.GET_JOB_TITLES,
				payload: {
					loading: false,
					data: {
						...response.data,
					},
				},
			});

			return response.data;
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: SettingsStructure.GET_JOB_TITLES,
				payload: { loading: false },
			});
		}
	};
};

/**
 * @function
 * @param { user_id } Id // Get userId from state
 */
export const deactivateJobTitle = (Id) => {
	return async (dispatch) => {
		dispatch({
			type: SettingsStructure.DEACTIVATE_JOB_TITLE,
			payload: { loading: true },
		});
		const options = API.options('DELETE', token, {});
		try {
			await API.request(`/utilities/job-title/${Id}/`, options);

			await dispatch({
				type: SettingsStructure.DEACTIVATE_JOB_TITLE,
				payload: { loading: false },
			});
			await dispatch(getAllJobTitles());

			return dispatch(
				setAlert(`Job title deactivated successfully`, 'success')
			);
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: SettingsStructure.DEACTIVATE_JOB_TITLE,
				payload: { loading: false },
			});
		}
	};
};

export const addNatureOfContract = (data) => {
	return async (dispatch) => {
		dispatch({
			type: SettingsStructure.ADD_NATURE_OF_CONTRACT,
			payload: {
				loading: true,
			},
		});
		const options = API.options('POST', token, { data });

		try {
			await API.request('/utilities/contract-nature/', options);

			dispatch({
				type: SettingsStructure.ADD_NATURE_OF_CONTRACT,
				payload: {
					loading: false,
				},
			});

			dispatch(getAllNatureOfContracts());

			return dispatch(
				setAlert(`Nature of Contract added successfully.`, 'success')
			);
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: SettingsStructure.ADD_NATURE_OF_CONTRACT,
				payload: {
					loading: false,
				},
			});
			throw err;
		}
	};
};

export const editNatureOfContract = (id, data) => {
	return async (dispatch) => {
		dispatch({
			type: SettingsStructure.EDIT_NATURE_OF_CONTRACT,
			payload: {
				loading: true,
			},
		});

		const options = API.options('PATCH', token, { data });

		try {
			await API.request(`/utilities/contract-nature/${id}/`, options);

			dispatch({
				type: SettingsStructure.EDIT_NATURE_OF_CONTRACT,
				payload: {
					loading: false,
				},
			});
			dispatch(getAllNatureOfContracts());
			dispatch(setAlert(`Nature of contract updated successfully.`, 'success'));
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: SettingsStructure.EDIT_NATURE_OF_CONTRACT,
				payload: {
					loading: false,
				},
			});
			throw err;
		}
	};
};

export const getAllNatureOfContracts = (queryParam) => {
	return async (dispatch) => {
		dispatch({
			type: SettingsStructure.GET_NATURE_OF_CONTRACTS,
			payload: { loading: true },
		});
		const options = API.options('GET', token, {});
		try {
			const response = await API.request(
				`/utilities/contract-nature?${queryParam}`,
				options
			);

			await dispatch({
				type: SettingsStructure.GET_NATURE_OF_CONTRACTS,
				payload: {
					loading: false,
					data: {
						...response.data,
					},
				},
			});

			return response.data;
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: SettingsStructure.GET_NATURE_OF_CONTRACTS,
				payload: { loading: false },
			});
		}
	};
};

export const deactivateNatureOfContract = (Id) => {
	return async (dispatch) => {
		dispatch({
			type: SettingsStructure.DEACTIVATE_NATURE_OF_CONTRACT,
			payload: { loading: true },
		});
		const options = API.options('DELETE', token, {});
		try {
			await API.request(`/utilities/contract-nature/${Id}/`, options);

			await dispatch({
				type: SettingsStructure.DEACTIVATE_NATURE_OF_CONTRACT,
				payload: { loading: false },
			});
			await dispatch(getAllNatureOfContracts());

			return dispatch(
				setAlert(`Nature of contract deactivated successfully`, 'success')
			);
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: SettingsStructure.DEACTIVATE_NATURE_OF_CONTRACT,
				payload: { loading: false },
			});
		}
	};
};

export const addJobGrade = (data) => {
	return async (dispatch) => {
		dispatch({
			type: SettingsStructure.ADD_JOB_GRADE,
			payload: {
				loading: true,
			},
		});
		const options = API.options('POST', token, { data });

		try {
			await API.request('/utilities/job-grade/', options);

			dispatch({
				type: SettingsStructure.ADD_JOB_GRADE,
				payload: {
					loading: false,
				},
			});

			dispatch(getAllJobGrades());

			return dispatch(setAlert(`Job Grade added successfully.`, 'success'));
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: SettingsStructure.ADD_JOB_GRADE,
				payload: {
					loading: false,
				},
			});
			throw err;
		}
	};
};

export const editJobGrade = (id, data) => {
	return async (dispatch) => {
		dispatch({
			type: SettingsStructure.EDIT_JOB_GRADES,
			payload: {
				loading: true,
			},
		});

		const options = API.options('PATCH', token, { data });

		try {
			await API.request(`/utilities/job-grade/${id}/`, options);

			dispatch({
				type: SettingsStructure.EDIT_JOB_GRADES,
				payload: {
					loading: false,
				},
			});

			dispatch(getAllJobGrades());

			dispatch(setAlert(`Job Grade updated successfully.`, 'success'));
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: SettingsStructure.EDIT_JOB_GRADES,
				payload: {
					loading: false,
				},
			});
			throw err;
		}
	};
};

export const getAllJobGrades = (queryParam) => {
	return async (dispatch) => {
		dispatch({
			type: SettingsStructure.GET_JOB_GRADES,
			payload: { loading: true },
		});
		const options = API.options('GET', token, {});
		try {
			const response = await API.request(
				`/utilities/job-grade?${queryParam}`,
				options
			);

			await dispatch({
				type: SettingsStructure.GET_JOB_GRADES,
				payload: {
					loading: false,
					data: {
						...response.data,
					},
				},
			});

			return response.data;
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: SettingsStructure.GET_JOB_GRADES,
				payload: { loading: false },
			});
		}
	};
};

export const deactivateJobGrades = (Id) => {
	return async (dispatch) => {
		dispatch({
			type: SettingsStructure.DEACTIVATE_JOB_GRADES,
			payload: { loading: true },
		});
		const options = API.options('DELETE', token, {});
		try {
			await API.request(`/utilities/job-grade/${Id}/`, options);

			await dispatch({
				type: SettingsStructure.DEACTIVATE_JOB_GRADES,
				payload: { loading: false },
			});
			await dispatch(getAllJobGrades());

			return dispatch(
				setAlert(`Nature of contract deactivated successfully`, 'success')
			);
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: SettingsStructure.DEACTIVATE_JOB_GRADES,
				payload: { loading: false },
			});
		}
	};
};

export const addTerminateReason = (data) => {
	return async (dispatch) => {
		dispatch({
			type: SettingsStructure.ADD_TERMINATE_REASON,
			payload: {
				loading: true,
			},
		});
		const options = API.options('POST', token, { data });

		try {
			await API.request('/utilities/terminate-reason/', options);

			dispatch({
				type: SettingsStructure.ADD_TERMINATE_REASON,
				payload: {
					loading: false,
				},
			});

			dispatch(getAllTerminateReason());

			return dispatch(
				setAlert(`Terminate Reason added successfully.`, 'success')
			);
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: SettingsStructure.ADD_TERMINATE_REASON,
				payload: {
					loading: false,
				},
			});
			throw err;
		}
	};
};

export const editTerminateReason = (id, data) => {
	return async (dispatch) => {
		dispatch({
			type: SettingsStructure.EDIT_TERMINATE_REASON,
			payload: {
				loading: true,
			},
		});

		const options = API.options('PATCH', token, { data });

		try {
			await API.request(`/utilities/terminate-reason/${id}/`, options);

			dispatch({
				type: SettingsStructure.EDIT_TERMINATE_REASON,
				payload: {
					loading: false,
				},
			});

			dispatch(getAllJobGrades());

			dispatch(setAlert(`Terminate Reason updated successfully.`, 'success'));
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: SettingsStructure.EDIT_TERMINATE_REASON,
				payload: {
					loading: false,
				},
			});
			throw err;
		}
	};
};

export const getAllTerminateReason = (queryParam) => {
	return async (dispatch) => {
		dispatch({
			type: SettingsStructure.GET_TERMINATE_REASON,
			payload: { loading: true },
		});
		const options = API.options('GET', token, {});
		try {
			const response = await API.request(
				`/utilities/terminate-reason/?${queryParam}`,
				options
			);

			await dispatch({
				type: SettingsStructure.GET_TERMINATE_REASON,
				payload: {
					loading: false,
					data: {
						...response.data,
					},
				},
			});

			return response.data;
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: SettingsStructure.GET_TERMINATE_REASON,
				payload: { loading: false },
			});
		}
	};
};

export const deactivateTerminateReason = (Id) => {
	return async (dispatch) => {
		dispatch({
			type: SettingsStructure.DEACTIVATE_TERMINATE_REASON,
			payload: { loading: true },
		});
		const options = API.options('DELETE', token, {});
		try {
			await API.request(`/utilities/terminate-reason/${Id}/`, options);

			await dispatch({
				type: SettingsStructure.DEACTIVATE_TERMINATE_REASON,
				payload: { loading: false },
			});
			await dispatch(getAllJobGrades());

			return dispatch(
				setAlert(`Terminate Reason deactivated successfully`, 'success')
			);
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: SettingsStructure.DEACTIVATE_TERMINATE_REASON,
				payload: { loading: false },
			});
		}
	};
};

export const addReinstateReason = (data) => {
	return async (dispatch) => {
		dispatch({
			type: SettingsStructure.ADD_REINSTATE_REASON,
			payload: {
				loading: true,
			},
		});
		const options = API.options('POST', token, { data });

		try {
			await API.request('/utilities/reinstate-reason/', options);

			dispatch({
				type: SettingsStructure.ADD_REINSTATE_REASON,
				payload: {
					loading: false,
				},
			});

			dispatch(getAllReinstateReason());

			return dispatch(
				setAlert(`Reinstate Reason added successfully.`, 'success')
			);
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: SettingsStructure.ADD_REINSTATE_REASON,
				payload: {
					loading: false,
				},
			});
			throw err;
		}
	};
};

export const editReinstateReason = (id, data) => {
	return async (dispatch) => {
		dispatch({
			type: SettingsStructure.EDIT_REINSTATE_REASON,
			payload: {
				loading: true,
			},
		});

		const options = API.options('PATCH', token, { data });

		try {
			await API.request(`/utilities/reinstate-reason/${id}/`, options);

			dispatch({
				type: SettingsStructure.EDIT_REINSTATE_REASON,
				payload: {
					loading: false,
				},
			});

			dispatch(getAllReinstateReason());

			dispatch(setAlert(`Reinstate Reason updated successfully.`, 'success'));
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: SettingsStructure.EDIT_REINSTATE_REASON,
				payload: {
					loading: false,
				},
			});
			throw err;
		}
	};
};

export const getAllReinstateReason = () => {
	return async (dispatch) => {
		dispatch({
			type: SettingsStructure.GET_REINSTATE_REASON,
			payload: { loading: true },
		});
		const options = API.options('GET', token, {});
		try {
			const response = await API.request(
				`/utilities/reinstate-reason/`,
				options
			);

			await dispatch({
				type: SettingsStructure.GET_REINSTATE_REASON,
				payload: {
					loading: false,
					data: {
						...response.data,
					},
				},
			});

			return response.data;
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: SettingsStructure.GET_REINSTATE_REASON,
				payload: { loading: false },
			});
		}
	};
};

export const deactivateReinstateReason = (Id) => {
	return async (dispatch) => {
		dispatch({
			type: SettingsStructure.DEACTIVATE_REINSTATE_REASON,
			payload: { loading: true },
		});
		const options = API.options('DELETE', token, {});
		try {
			await API.request(`/utilities/reinstate-reason/${Id}/`, options);

			await dispatch({
				type: SettingsStructure.DEACTIVATE_REINSTATE_REASON,
				payload: { loading: false },
			});
			await dispatch(getAllJobGrades());

			return dispatch(
				setAlert(`Terminate Reason deactivated successfully`, 'success')
			);
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: SettingsStructure.DEACTIVATE_REINSTATE_REASON,
				payload: { loading: false },
			});
		}
	};
};

export const addPensionSetting = (data) => {
	return async (dispatch) => {
		dispatch({
			type: SettingsStructure.ADD_PENSION_SETTINGS,
			payload: {
				loading: true,
			},
		});
		const options = API.options('POST', token, { data });

		try {
			await API.request('/payroll/pension-setting/', options);

			dispatch({
				type: SettingsStructure.ADD_PENSION_SETTINGS,
				payload: {
					loading: false,
				},
			});
			dispatch(getPensionSetting());

			return dispatch(
				setAlert(`Pension setting saved successfully.`, 'success')
			);
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: SettingsStructure.ADD_PENSION_SETTINGS,
				payload: {
					loading: false,
				},
			});
			throw err;
		}
	};
};

export const getPensionSetting = () => {
	return async (dispatch) => {
		dispatch({
			type: SettingsStructure.GET_PENSION_SETTINGS,
			payload: { loading: true },
		});
		const options = API.options('GET', token, {});
		try {
			const response = await API.request(`/payroll/pension-setting/`, options);

			await dispatch({
				type: SettingsStructure.GET_PENSION_SETTINGS,
				payload: {
					loading: false,
					data: {
						...response.data,
					},
				},
			});

			return response.data;
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: SettingsStructure.GET_PENSION_SETTINGS,
				payload: { loading: false },
			});
		}
	};
};
