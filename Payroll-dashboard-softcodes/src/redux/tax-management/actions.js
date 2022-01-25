/* -------------------------- Internal Dependencies ------------------------- */

import { setAlert } from 'redux/alert/actions';
import API from 'services/api';
import { getError } from 'utils';

import { token } from 'utils/user_persist';
import TaxManagementActions from './types';

/**
 * @namespace dispatch
 */

/**
 * Activate License
 * @function
 * @param {Object} data
 * @returns {Function}
 */
export const addTaxReliefGroup = (data) => {
	return async (dispatch) => {
		dispatch({
			type: TaxManagementActions.ADD_TAX_RELIEF_GROUP,
			payload: {
				loading: true,
			},
		});
		const options = API.options('POST', token, { data });

		try {
			await API.request('/payroll/tax-relief-group/', options);

			dispatch({
				type: TaxManagementActions.ADD_TAX_RELIEF_GROUP,
				payload: {
					loading: false,
				},
			});

			dispatch(getAllTaxReliefGroups());

			return dispatch(
				setAlert(`Tax Relief Group added successfully.`, 'success')
			);
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: TaxManagementActions.ADD_TAX_RELIEF_GROUP,
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
export const editTaxReliefGroup = (id, data) => {
	return async (dispatch) => {
		dispatch({
			type: TaxManagementActions.EDIT_TAX_RELIEF_GROUP,
			payload: {
				loading: true,
			},
		});
		const options = API.options('PATCH', token, { data });

		try {
			await API.request(`/payroll/tax-relief-group/${id}/`, options);

			dispatch({
				type: TaxManagementActions.EDIT_TAX_RELIEF_GROUP,
				payload: {
					loading: false,
				},
			});

			dispatch(setAlert(`Tax Relief Group updated successfully.`, 'success'));

			return Promise.all([dispatch(getAllTaxReliefGroups())]);
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: TaxManagementActions.EDIT_TAX_RELIEF_GROUP,
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
export const getAllTaxReliefGroups = (
	search = '',
	page = 1,
	queryParam = '',
	url
) => {
	return async (dispatch) => {
		dispatch({
			type: TaxManagementActions.GET_TAX_RELIEF_GROUP,
			payload: { loading: true },
		});
		const options = API.options('GET', token, {});
		try {
			const response = !url
				? await API.request(
						`/payroll/tax-relief-group/?page=${page}&search=${search}&${queryParam}`,
						options
				  )
				: await API.request(url, options, true);

			await dispatch({
				type: TaxManagementActions.GET_TAX_RELIEF_GROUP,
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
				type: TaxManagementActions.GET_TAX_RELIEF_GROUP,
				payload: { loading: false },
			});
		}
	};
};
/**
 * @function
 * @param { user_id } Id // Get userId from state
 */
export const deactivateTaxReliefGroup = (Id) => {
	return async (dispatch) => {
		dispatch({
			type: TaxManagementActions.DEACTIVATE_TAX_RELIEF_GROUP,
			payload: { loading: true },
		});
		const options = API.options('DELETE', token, {});
		try {
			await API.request(`/payroll/tax-relief-group/${Id}/`, options);

			await dispatch({
				type: TaxManagementActions.DEACTIVATE_TAX_RELIEF_GROUP,
				payload: { loading: false },
			});
			await dispatch(getAllTaxReliefGroups());

			dispatch(
				setAlert(`Tax Relief Group deactivated successfully`, 'success')
			);
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: TaxManagementActions.DEACTIVATE_TAX_RELIEF_GROUP,
				payload: { loading: false },
			});
		}
	};
};

export const addTaxRelief = (data) => {
	return async (dispatch) => {
		dispatch({
			type: TaxManagementActions.ADD_TAX_RELIEF,
			payload: {
				loading: true,
			},
		});
		const options = API.options('POST', token, { data });

		try {
			await API.request('/payroll/tax-relief/', options);

			dispatch({
				type: TaxManagementActions.ADD_TAX_RELIEF,
				payload: {
					loading: false,
				},
			});

			dispatch(getAllTaxReliefs());

			return dispatch(setAlert(`Tax Relief added successfully.`, 'success'));
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: TaxManagementActions.ADD_TAX_RELIEF,
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
export const editTaxRelief = (id, data) => {
	return async (dispatch) => {
		dispatch({
			type: TaxManagementActions.EDIT_TAX_RELIEF,
			payload: {
				loading: true,
			},
		});
		const options = API.options('PATCH', token, { data });

		try {
			await API.request(`/payroll/tax-relief/${id}/`, options);

			dispatch({
				type: TaxManagementActions.EDIT_TAX_RELIEF,
				payload: {
					loading: false,
				},
			});

			dispatch(setAlert(`Tax Relief updated successfully.`, 'success'));

			return Promise.all([dispatch(getAllTaxReliefs())]);
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: TaxManagementActions.EDIT_TAX_RELIEF,
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
export const getAllTaxReliefs = (
	search = '',
	page = 1,
	url,
	is_active = null
) => {
	return async (dispatch) => {
		dispatch({
			type: TaxManagementActions.GET_TAX_RELIEF,
			payload: { loading: true },
		});
		const options = API.options('GET', token, {});
		try {
			const response = !url
				? await API.request(
						`/payroll/tax-relief/?page=${page}&search=${search}&is_active=${is_active}`,
						options
				  )
				: await API.request(url, options, true);

			await dispatch({
				type: TaxManagementActions.GET_TAX_RELIEF,
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
				type: TaxManagementActions.GET_TAX_RELIEF,
				payload: { loading: false },
			});
		}
	};
};
/**
 * @function
 * @param { user_id } Id // Get userId from state
 */
export const deactivateTaxRelief = (Id) => {
	return async (dispatch) => {
		dispatch({
			type: TaxManagementActions.DEACTIVATE_TAX_RELIEF,
			payload: { loading: true },
		});
		const options = API.options('DELETE', token, {});
		try {
			await API.request(`/payroll/tax-relief/${Id}/`, options);

			await dispatch({
				type: TaxManagementActions.DEACTIVATE_TAX_RELIEF,
				payload: { loading: false },
			});
			await dispatch(getAllTaxReliefGroups());

			dispatch(setAlert(`Tax Relief deactivated successfully`, 'success'));
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: TaxManagementActions.DEACTIVATE_TAX_RELIEF,
				payload: { loading: false },
			});
		}
	};
};
