/* -------------------------- Internal Dependencies ------------------------- */

import { setAlert } from 'redux/alert/actions';
import API from 'services/api';
import { getError } from 'utils';
import history from 'utils/history';
import { token } from 'utils/user_persist';
import LeaveStructureActions from './types';

/**
 * @namespace dispatch
 */

/**
 * Activate License
 * @function
 * @param {Object} data
 * @returns {Function}
 */
export const addLeave = (data) => {
	return async (dispatch) => {
		dispatch({
			type: LeaveStructureActions.ADD_LEAVE,
			payload: {
				loading: true,
			},
		});
		const options = API.options('POST', token, { data });

		try {
			await API.request('/company/leave/', options);

			dispatch({
				type: LeaveStructureActions.ADD_LEAVE,
				payload: {
					loading: false,
				},
			});

			dispatch(getAllLeaves());

			return dispatch(setAlert(`Leave added successfully.`, 'success'));
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: LeaveStructureActions.ADD_LEAVE,
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
export const addCategory = (data) => {
	return async (dispatch) => {
		dispatch({
			type: LeaveStructureActions.ADD_CATEGORY,
			payload: {
				loading: true,
			},
		});
		const options = API.options('POST', token, { data });

		try {
			await API.request('/company/leave-category/', options);

			dispatch({
				type: LeaveStructureActions.ADD_CATEGORY,
				payload: {
					loading: false,
				},
			});

			dispatch(getAllLeaveCategory());

			return dispatch(
				setAlert(`Leave Category added successfully.`, 'success')
			);
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: LeaveStructureActions.ADD_CATEGORY,
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
export const editLeave = (id, data) => {
	return async (dispatch) => {
		dispatch({
			type: LeaveStructureActions.EDIT_LEAVE,
			payload: {
				loading: true,
			},
		});

		const options = API.options('PATCH', token, { data });

		try {
			await API.request(`/company/leave/${id}/`, options);

			dispatch({
				type: LeaveStructureActions.EDIT_LEAVE,
				payload: {
					loading: false,
				},
			});

			dispatch(setAlert(`Leave updated successfully.`, 'success'));
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: LeaveStructureActions.EDIT_LEAVE,
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
export const editCategory = (id, data) => {
	return async (dispatch) => {
		dispatch({
			type: LeaveStructureActions.EDIT_CATEGORY,
			payload: {
				loading: true,
			},
		});
		const options = API.options('PATCH', token, { data });

		try {
			await API.request(`/company/leave-category/${id}/`, options);

			dispatch({
				type: LeaveStructureActions.EDIT_CATEGORY,
				payload: {
					loading: false,
				},
			});

			dispatch(setAlert(`Leave Category updated successfully.`, 'success'));
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: LeaveStructureActions.EDIT_CATEGORY,
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
export const getLeaveById = (Id, gender = '', queryParam) => {
	return async (dispatch) => {
		dispatch({
			type: LeaveStructureActions.GET_BY_ID,
			payload: { loading: true },
		});
		const options = API.options('GET', token, {});
		try {
			const response = await API.request(
				`/company/leave-category/${Id}/?gender=${gender}&${queryParam}`,
				options
			);

			await dispatch({
				type: LeaveStructureActions.GET_BY_ID,
				payload: { loading: false, data: response.data },
			});

			return response.data;
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: LeaveStructureActions.GET_BY_ID,
				payload: { loading: false },
			});
		}
	};
};
/**
 * @function
 * @param { user_id } Id // Get userId from state
 */
export const getAllLeaves = (search = '', page = 1, url) => {
	return async (dispatch) => {
		dispatch({
			type: LeaveStructureActions.GET_LEAVE,
			payload: { loading: true },
		});
		const options = API.options('GET', token, {});
		try {
			const response = !url
				? await API.request(
						`/company/leave/?page=${page}&search=${search}`,
						options
				  )
				: await API.request(url, options, true);

			await dispatch({
				type: LeaveStructureActions.GET_LEAVE,
				payload: {
					loading: false,
					data: {
						current_page: page || url.split('?')[0].replace('page=', ''),
						...response.data,
					},
				},
			});

			return response.data;
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: LeaveStructureActions.GET_LEAVE,
				payload: { loading: false },
			});
		}
	};
};
/**
 * @function
 * @param { user_id } Id // Get userId from state
 */
export const getAllLeaveCategory = (
	search = '',
	page = 1,
	queryParam = '',
	url
) => {
	return async (dispatch) => {
		dispatch({
			type: LeaveStructureActions.GET_CATEGORY,
			payload: { loading: true },
		});
		const options = API.options('GET', token, {});
		try {
			const response = !url
				? await API.request(
						`/company/leave-category/?page=${page}&search=${search}&${queryParam}`,
						options
				  )
				: await API.request(url, options, true);

			await dispatch({
				type: LeaveStructureActions.GET_CATEGORY,
				payload: {
					loading: false,
					data: {
						current_page: page || url.split('?')[0].replace('page=', ''),
						...response.data,
					},
				},
			});

			return response.data;
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: LeaveStructureActions.GET_CATEGORY,
				payload: { loading: false },
			});
		}
	};
};
/**
 * @function
 * @param { user_id } Id // Get userId from state
 */
export const deactivateLeave = (Id, isReRoute) => {
	return async (dispatch) => {
		dispatch({
			type: LeaveStructureActions.DEACTIVATE_LEAVE,
			payload: { loading: true },
		});
		const options = API.options('DELETE', token, {});
		try {
			await API.request(`/company/leave/${Id}/`, options);

			await dispatch({
				type: LeaveStructureActions.DEACTIVATE_LEAVE,
				payload: { loading: false },
			});

			if (isReRoute) {
				return history.push('/dashboard/leaves');
			}
			await dispatch(getAllLeaves());

			return dispatch(setAlert(`Leave deactivated successfully`, 'success'));
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: LeaveStructureActions.DEACTIVATE_LEAVE,
				payload: { loading: false },
			});
		}
	};
};
/**
 * @function
 * @param { user_id } Id // Get userId from state
 */
export const deactivateCategory = (Id, isReRoute) => {
	return async (dispatch) => {
		dispatch({
			type: LeaveStructureActions.DEACTIVATE_CATEGORY,
			payload: { loading: true },
		});
		const options = API.options('DELETE', token, {});
		try {
			await API.request(`/company/leave-category/${Id}/`, options);

			await dispatch({
				type: LeaveStructureActions.DEACTIVATE_CATEGORY,
				payload: { loading: false },
			});

			if (isReRoute) {
				return history.push('/dashboard/leaves');
			}
			await dispatch(getAllLeaveCategory());
			dispatch(setAlert(`Leave Category deactivated successfully`, 'success'));
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: LeaveStructureActions.DEACTIVATE_CATEGORY,
				payload: { loading: false },
			});
		}
	};
};

export const getEmployeeAvailableLeave = (employeeId) => {
	return async (dispatch) => {
		dispatch({
			type: LeaveStructureActions.GET_EMPLOYEE_AVAILABLE_LEAVE,
			payload: { loading: true },
		});
		const options = API.options('GET', token, {});
		try {
			const response = await API.request(
				`/employees/employee/${employeeId}/leave-workflow/`,
				options
			);

			await dispatch({
				type: LeaveStructureActions.GET_EMPLOYEE_AVAILABLE_LEAVE,
				payload: { loading: false, data: response.data },
			});

			return response.data;
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: LeaveStructureActions.GET_EMPLOYEE_AVAILABLE_LEAVE,
				payload: { loading: false },
			});
		}
	};
};

export const saveLeaveWorkflow = (employeeId, data, isEss = false) => {
	return async (dispatch) => {
		dispatch({
			type: LeaveStructureActions.SAVE_EMPLOYEE_WORKFLOW_LEAVE,
			payload: {
				loading: true,
			},
		});
		const options = API.options('POST', token, { data });
		let url = `/employees/employee/${employeeId}/leave-workflow/`;
		if (isEss) {
			url = `/ess/employee/${employeeId}/leave-workflow/`;
		}
		try {
			await API.request(url, options);

			dispatch({
				type: LeaveStructureActions.SAVE_EMPLOYEE_WORKFLOW_LEAVE,
				payload: {
					loading: false,
				},
			});

			dispatch(setAlert(`Leave saved successfully`, 'success'));
			if (!isEss) history.push(`/dashboard/employee/detail/${employeeId}`);
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: LeaveStructureActions.SAVE_EMPLOYEE_WORKFLOW_LEAVE,
				payload: {
					loading: false,
				},
			});
			throw err;
		}
	};
};

export const getEmployeesLeaveRequests = () => {
	return async (dispatch) => {
		dispatch({
			type: LeaveStructureActions.GET_EMPLOYEE_LEAVE_REQUEST,
			payload: { loading: true },
		});
		const options = API.options('GET', token, {});
		try {
			const response = await API.request(`/company/leave-request/`, options);

			await dispatch({
				type: LeaveStructureActions.GET_EMPLOYEE_LEAVE_REQUEST,
				payload: { loading: false, data: response.data },
			});

			return response.data;
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: LeaveStructureActions.GET_EMPLOYEE_LEAVE_REQUEST,
				payload: { loading: false },
			});
		}
	};
};

export const approveRejectLeaveRequest = (applicationId, reject = false) => {
	return async (dispatch) => {
		dispatch({
			type: LeaveStructureActions.APPROVE_REJECT_LEAVE_REQUEST,
			payload: { loading: true },
		});
		const options = API.options(reject ? 'PUT' : 'POST', token, {});
		try {
			const response = await API.request(
				`/company/leave-request/${applicationId}/`,
				options
			);

			window.location.reload();

			await dispatch({
				type: LeaveStructureActions.APPROVE_REJECT_LEAVE_REQUEST,
				payload: { loading: false, data: response.data },
			});

			return response.data;
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: LeaveStructureActions.APPROVE_REJECT_LEAVE_REQUEST,
				payload: { loading: false },
			});
		}
	};
};
