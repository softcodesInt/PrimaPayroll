/* -------------------------- Internal Dependencies ------------------------- */

import { setAlert } from 'redux/alert/actions';
import API from 'services/api';
import { capitalize, getError } from 'utils';
import history from 'utils/history';
import { token } from 'utils/user_persist';
import CompanyStructureActions from './types';

/**
 * @namespace dispatch
 */

/**
 * Activate License
 * @function
 * @param {Object} data
 * @returns {Function}
 */
export const addItemOrHead = (data) => {
	return async (dispatch) => {
		dispatch({
			type: CompanyStructureActions.ADD_HEAD_OR_ITEM,
			payload: {
				loading: true,
			},
		});
		const options = API.options('POST', token, { data });

		try {
			await API.request('/company/hierarchy/', options);

			dispatch({
				type: CompanyStructureActions.ADD_HEAD_OR_ITEM,
				payload: {
					loading: false,
				},
			});

			dispatch(getAllHeads());

			dispatch(getAllItems());

			return dispatch(
				setAlert(
					`${data?.is_header ? 'Head' : 'Item'} added successfully.`,
					'success'
				)
			);
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: CompanyStructureActions.ADD_HEAD_OR_ITEM,
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
export const editItemOrHead = (id, data, isViewHead) => {
	return async (dispatch) => {
		dispatch({
			type: CompanyStructureActions.ADD_HEAD_OR_ITEM,
			payload: {
				loading: true,
			},
		});
		const options = API.options('PATCH', token, { data });

		try {
			await API.request(
				`/company/hierarchy/${id}/?is_head=${capitalize(`${data?.is_header}`)}`,
				options
			);

			dispatch({
				type: CompanyStructureActions.ADD_HEAD_OR_ITEM,
				payload: {
					loading: false,
				},
			});

			dispatch(
				setAlert(
					`${data?.is_header ? 'Head' : 'Item'} updated successfully.`,
					'success'
				)
			);
			if (isViewHead !== undefined) {
				return dispatch(getHeadById(id));
			} else {
				return Promise.all([dispatch(getAllHeads()), dispatch(getAllItems())]);
			}
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: CompanyStructureActions.ADD_HEAD_OR_ITEM,
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
export const getHeadById = (Id) => {
	return async (dispatch) => {
		dispatch({
			type: CompanyStructureActions.GET_BY_ID,
			payload: { loading: true },
		});
		const options = API.options('GET', token, {});
		try {
			const response = await API.request(
				`/company/hierarchy/${Id}?is_head=True`,
				options
			);

			await dispatch({
				type: CompanyStructureActions.GET_BY_ID,
				payload: { loading: false, data: response.data },
			});

			return response.data;
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: CompanyStructureActions.GET_BY_ID,
				payload: { loading: false },
			});
		}
	};
};

export const getAllCompanyStructure = (search = '') => {
	return async (dispatch) => {
		dispatch({
			type: CompanyStructureActions.GET_ALL_COMPANY_STRUCTURE,
			payload: { loading: true },
		});
		const options = API.options('GET', token, {});
		try {
			const response = await API.request(
				`/company/hierarchy/?sort_by=all&&search=${search}`,
				options
			);

			await dispatch({
				type: CompanyStructureActions.GET_ALL_COMPANY_STRUCTURE,
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
				type: CompanyStructureActions.GET_ALL_COMPANY_STRUCTURE,
				payload: { loading: false },
			});
		}
	};
};

/**
 * @function
 * @param { user_id } Id // Get userId from state
 */
export const getAllHeads = (search = '', page = 1, url) => {
	return async (dispatch) => {
		dispatch({
			type: CompanyStructureActions.GET_HEAD,
			payload: { loading: true },
		});
		const options = API.options('GET', token, {});
		try {
			const response = !url
				? await API.request(
						`/company/hierarchy/?is_head=True&page=${page}&search=${search}`,
						options
				  )
				: await API.request(url, options, true);

			await dispatch({
				type: CompanyStructureActions.GET_HEAD,
				payload: {
					loading: false,
					data: {
						current_page: page || url.split('&')[1].replace('page=', ''),
						...response.data,
					},
				},
			});

			return response.data;
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: CompanyStructureActions.GET_HEAD,
				payload: { loading: false },
			});
		}
	};
};
/**
 * @function
 * @param { user_id } Id // Get userId from state
 */
export const getAllItems = (search = '', page = 1, url) => {
	return async (dispatch) => {
		dispatch({
			type: CompanyStructureActions.GET_ITEM,
			payload: { loading: true },
		});
		const options = API.options('GET', token, {});
		try {
			const response = !url
				? await API.request(
						`/company/hierarchy/?is_head=False&page=${page}&search${search}`,
						options
				  )
				: await API.request(url, options, true);

			await dispatch({
				type: CompanyStructureActions.GET_ITEM,
				payload: {
					loading: false,
					data: {
						current_page: page || url.split('&')[1].replace('page=', ''),
						...response.data,
					},
				},
			});

			return response.data;
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: CompanyStructureActions.GET_ITEM,
				payload: { loading: false },
			});
		}
	};
};
/**
 * @function
 * @param { user_id } Id // Get userId from state
 */
export const deactivateHeadOrItemById = (Id, type, isReRoute) => {
	return async (dispatch) => {
		dispatch({
			type: CompanyStructureActions.GET_BY_ID,
			payload: { loading: true },
		});
		const options = API.options('DELETE', token, {});
		try {
			await API.request(
				`/company/hierarchy/${Id}/?is_head=${capitalize(`${type}`)}`,
				options
			);

			await dispatch({
				type: CompanyStructureActions.GET_BY_ID,
				payload: { loading: false },
			});
			dispatch(
				setAlert(
					`${type === true ? 'Head' : 'Item'} deactivated successfully`,
					'success'
				)
			);

			if (isReRoute) {
				return history.push('/dashboard/company-structure');
			} else {
				return Promise.all([dispatch(getAllHeads()), dispatch(getAllItems())]);
			}
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: CompanyStructureActions.GET_BY_ID,
				payload: { loading: false },
			});
		}
	};
};
