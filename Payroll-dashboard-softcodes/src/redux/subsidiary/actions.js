/* -------------------------- Internal Dependencies ------------------------- */

import { setAlert } from 'redux/alert/actions';
import API from 'services/api';
import { getError } from 'utils';
import history from 'utils/history';
import { token } from 'utils/user_persist';
import SubsidiaryStructureActions from './types';

/**
 * @namespace dispatch
 */

/**
 * Activate License
 * @function
 * @param {Object} data
 * @returns {Function}
 */
export const addSubsidiary = (data) => {
	return async (dispatch) => {
		dispatch({
			type: SubsidiaryStructureActions.ADD_SUBSIDIARY,
			payload: {
				loading: true,
			},
		});
		const options = API.options('POST', token, {
			data,
			'Content-Type': 'multipart/form-data',
		});

		try {
			await API.request('/company/subsidiary/', options);

			dispatch({
				type: SubsidiaryStructureActions.ADD_SUBSIDIARY,
				payload: {
					loading: false,
				},
			});

			dispatch(getAllSubsidiary());

			return dispatch(setAlert(`Subsidiary added successfully.`, 'success'));
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: SubsidiaryStructureActions.ADD_SUBSIDIARY,
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
export const editSubsidiary = (id, data, isViewHead) => {
	return async (dispatch) => {
		dispatch({
			type: SubsidiaryStructureActions.EDIT_SUBSIDIARY,
			payload: {
				loading: true,
			},
		});
		const options = API.options('PATCH', token, { data });

		try {
			await API.request(`/company/subsidiary/${id}/`, options);

			dispatch({
				type: SubsidiaryStructureActions.EDIT_SUBSIDIARY,
				payload: {
					loading: false,
				},
			});

			dispatch(setAlert(`Subsidiary updated successfully.`, 'success'));

			return Promise.all([dispatch(getAllSubsidiary())]);
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: SubsidiaryStructureActions.EDIT_SUBSIDIARY,
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
export const getSubsidiaryById = (Id) => {
	return async (dispatch) => {
		dispatch({
			type: SubsidiaryStructureActions.GET_BY_ID,
			payload: { loading: true },
		});
		const options = API.options('GET', token, {});
		try {
			const response = await API.request(`/company/subsidiary/${Id}/`, options);

			await dispatch({
				type: SubsidiaryStructureActions.GET_BY_ID,
				payload: { loading: false, data: response.data },
			});

			return response.data;
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: SubsidiaryStructureActions.GET_BY_ID,
				payload: { loading: false },
			});
		}
	};
};
/**
 * @function
 * @param { user_id } Id // Get userId from state
 */
export const getAllSubsidiary = (
	search = '',
	page = 1,
	url,
	is_active = null
) => {
	return async (dispatch) => {
		dispatch({
			type: SubsidiaryStructureActions.GET_SUBSIDIARY,
			payload: { loading: true },
		});
		const options = API.options('GET', token, {});
		try {
			const response = !url
				? await API.request(
						`/company/subsidiary/?page=${page}&search=${search}&is_active=${is_active}`,
						options
				  )
				: await API.request(url, options, true);

			await dispatch({
				type: SubsidiaryStructureActions.GET_SUBSIDIARY,
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
				type: SubsidiaryStructureActions.GET_SUBSIDIARY,
				payload: { loading: false },
			});
		}
	};
};
/**
 * @function
 * @param { user_id } Id // Get userId from state
 */
export const deactivateSubsidiary = (Id, isReRoute) => {
	return async (dispatch) => {
		dispatch({
			type: SubsidiaryStructureActions.DEACTIVATE_SUBSIDIARY,
			payload: { loading: true },
		});
		const options = API.options('DELETE', token, {});
		try {
			await API.request(`/company/subsidiary/${Id}/`, options);

			await dispatch({
				type: SubsidiaryStructureActions.DEACTIVATE_SUBSIDIARY,
				payload: { loading: false },
			});
			await dispatch(getAllSubsidiary());

			if (isReRoute) {
				return history.push('/dashboard/subsidiaries');
			}

			dispatch(setAlert(`Subsidiary deactivated successfully`, 'success'));
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: SubsidiaryStructureActions.DEACTIVATE_SUBSIDIARY,
				payload: { loading: false },
			});
		}
	};
};
