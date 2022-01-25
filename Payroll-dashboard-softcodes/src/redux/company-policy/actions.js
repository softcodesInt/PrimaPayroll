/* -------------------------- Internal Dependencies ------------------------- */

import { setAlert } from 'redux/alert/actions';
import API from 'services/api';
import { getError } from 'utils';

import { token } from 'utils/user_persist';
import CompanyPolicyActions from './types';

/**
 * @namespace dispatch
 */

/**
 * Activate License
 * @function
 * @param {Object} data
 * @returns {Function}
 */
export const addCompanyPolicy = (data) => {
	return async (dispatch) => {
		dispatch({
			type: CompanyPolicyActions.ADD_COMPANY_POLICY,
			payload: {
				loading: true,
			},
		});
		const options = API.options('POST', token, { data });

		try {
			await API.request('/company/company-policy/', options);

			dispatch({
				type: CompanyPolicyActions.ADD_COMPANY_POLICY,
				payload: {
					loading: false,
				},
			});

			dispatch(getAllCompanyPolicy());

			return dispatch(setAlert(`Policy added successfully.`, 'success'));
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: CompanyPolicyActions.ADD_COMPANY_POLICY,
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
export const editCompanyPolicy = (id, data) => {
	return async (dispatch) => {
		dispatch({
			type: CompanyPolicyActions.EDIT_COMPANY_POLICY,
			payload: {
				loading: true,
			},
		});
		const options = API.options('PATCH', token, { data });

		try {
			await API.request(`/company/company-policy/${id}/`, options);

			dispatch({
				type: CompanyPolicyActions.EDIT_COMPANY_POLICY,
				payload: {
					loading: false,
				},
			});

			dispatch(setAlert(`Policy updated successfully.`, 'success'));

			return Promise.all([dispatch(getAllCompanyPolicy())]);
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: CompanyPolicyActions.EDIT_COMPANY_POLICY,
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
export const getAllCompanyPolicy = (
	search = '',
	page = 1,
	url,
	is_active = null
) => {
	return async (dispatch) => {
		dispatch({
			type: CompanyPolicyActions.GET_COMPANY_POLICY,
			payload: { loading: true },
		});
		const options = API.options('GET', token, {});
		try {
			const response = !url
				? await API.request(
						`/company/company-policy/?page=${page}&search=${search}&is_active=${is_active}`,
						options
				  )
				: await API.request(url, options, true);

			await dispatch({
				type: CompanyPolicyActions.GET_COMPANY_POLICY,
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
				type: CompanyPolicyActions.GET_COMPANY_POLICY,
				payload: { loading: false },
			});
		}
	};
};
/**
 * @function
 * @param { user_id } Id // Get userId from state
 */
export const deactivateCompanyPolicy = (Id) => {
	return async (dispatch) => {
		dispatch({
			type: CompanyPolicyActions.DEACTIVATE_COMPANY_POLICY,
			payload: { loading: true },
		});
		const options = API.options('DELETE', token, {});
		try {
			await API.request(`/company/company-policy/${Id}/`, options);

			await dispatch({
				type: CompanyPolicyActions.DEACTIVATE_COMPANY_POLICY,
				payload: { loading: false },
			});
			await dispatch(getAllCompanyPolicy());

			dispatch(setAlert(`Policy deactivated successfully`, 'success'));
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: CompanyPolicyActions.DEACTIVATE_COMPANY_POLICY,
				payload: { loading: false },
			});
		}
	};
};
/**
 * Activate License
 * @function
 * @param {Object} data
 * @returns {Function}
 */
export const addTaxTable = (data) => {
	return async (dispatch) => {
		dispatch({
			type: CompanyPolicyActions.ADD_TAX_TABLE,
			payload: {
				loading: true,
			},
		});
		const options = API.options('POST', token, { data });

		try {
			await API.request('/company/tax-table/', options);

			dispatch({
				type: CompanyPolicyActions.ADD_TAX_TABLE,
				payload: {
					loading: false,
				},
			});

			dispatch(getAllTaxTable());

			return dispatch(setAlert(`Tax Table added successfully.`, 'success'));
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: CompanyPolicyActions.ADD_TAX_TABLE,
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
export const editTaxTable = (id, data) => {
	return async (dispatch) => {
		dispatch({
			type: CompanyPolicyActions.EDIT_TAX_TABLE,
			payload: {
				loading: true,
			},
		});
		const options = API.options('PATCH', token, { data });

		try {
			await API.request(`/company/tax-table/${id}/`, options);

			dispatch({
				type: CompanyPolicyActions.EDIT_TAX_TABLE,
				payload: {
					loading: false,
				},
			});

			dispatch(setAlert(`Tax Table updated successfully.`, 'success'));

			return Promise.all([dispatch(getAllTaxTable())]);
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: CompanyPolicyActions.EDIT_TAX_TABLE,
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
export const getAllTaxTable = (search = '', page = 1, url) => {
	return async (dispatch) => {
		dispatch({
			type: CompanyPolicyActions.GET_TAX_TABLE,
			payload: { loading: true },
		});
		const options = API.options('GET', token, {});
		try {
			const response = !url
				? await API.request(
						`/company/tax-table/?page=${page}&search=${search}`,
						options
				  )
				: await API.request(url, options, true);

			await dispatch({
				type: CompanyPolicyActions.GET_TAX_TABLE,
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
				type: CompanyPolicyActions.GET_TAX_TABLE,
				payload: { loading: false },
			});
		}
	};
};
/**
 * @function
 * @param { user_id } Id // Get userId from state
 */
export const deactivateTaxTable = (Id) => {
	return async (dispatch) => {
		dispatch({
			type: CompanyPolicyActions.DEACTIVATE_TAX_TABLE,
			payload: { loading: true },
		});
		const options = API.options('DELETE', token, {});
		try {
			await API.request(`/company/tax-table/${Id}/`, options);

			await dispatch({
				type: CompanyPolicyActions.DEACTIVATE_TAX_TABLE,
				payload: { loading: false },
			});
			await dispatch(getAllTaxTable());

			dispatch(setAlert(`Tax Table deactivated successfully`, 'success'));
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: CompanyPolicyActions.DEACTIVATE_TAX_TABLE,
				payload: { loading: false },
			});
		}
	};
};
/**
 * Activate License
 * @function
 * @param {Object} data
 * @returns {Function}
 */
export const addHoliday = (data) => {
	return async (dispatch) => {
		dispatch({
			type: CompanyPolicyActions.ADD_HOLIDAYS,
			payload: {
				loading: true,
			},
		});
		const options = API.options('POST', token, { data });

		try {
			await API.request('/company/holiday/', options);

			dispatch({
				type: CompanyPolicyActions.ADD_HOLIDAYS,
				payload: {
					loading: false,
				},
			});

			dispatch(getAllHoliday());

			return dispatch(setAlert(`Holiday added successfully.`, 'success'));
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: CompanyPolicyActions.ADD_HOLIDAYS,
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
export const editHoliday = (id, data) => {
	return async (dispatch) => {
		dispatch({
			type: CompanyPolicyActions.EDIT_HOLIDAYS,
			payload: {
				loading: true,
			},
		});
		const options = API.options('PATCH', token, { data });

		try {
			await API.request(`/company/holiday/${id}/`, options);

			dispatch({
				type: CompanyPolicyActions.EDIT_HOLIDAYS,
				payload: {
					loading: false,
				},
			});

			dispatch(setAlert(`Holiday updated successfully.`, 'success'));

			return Promise.all([dispatch(getAllHoliday())]);
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: CompanyPolicyActions.EDIT_HOLIDAYS,
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
export const getAllHoliday = (search = '', page = 1, url) => {
	return async (dispatch) => {
		dispatch({
			type: CompanyPolicyActions.GET_HOLIDAYS,
			payload: { loading: true },
		});
		const options = API.options('GET', token, {});
		try {
			const response = !url
				? await API.request(
						`/company/holiday/?page=${page}&search=${search}`,
						options
				  )
				: await API.request(url, options, true);

			await dispatch({
				type: CompanyPolicyActions.GET_HOLIDAYS,
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
				type: CompanyPolicyActions.GET_HOLIDAYS,
				payload: { loading: false },
			});
		}
	};
};
/**
 * @function
 * @param { user_id } Id // Get userId from state
 */
export const deactivateHoliday = (Id) => {
	return async (dispatch) => {
		dispatch({
			type: CompanyPolicyActions.DEACTIVATE_HOLIDAYS,
			payload: { loading: true },
		});
		const options = API.options('DELETE', token, {});
		try {
			await API.request(`/company/holiday/${Id}/`, options);

			await dispatch({
				type: CompanyPolicyActions.DEACTIVATE_HOLIDAYS,
				payload: { loading: false },
			});
			await dispatch(getAllHoliday());

			dispatch(setAlert(`Holiday deactivated successfully`, 'success'));
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: CompanyPolicyActions.DEACTIVATE_HOLIDAYS,
				payload: { loading: false },
			});
		}
	};
};
