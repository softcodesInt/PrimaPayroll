/* -------------------------- Internal Dependencies ------------------------- */
import sleep from 'codewonders-helpers/bundle-cjs/helpers/sleep';
import { setAlert } from 'redux/alert/actions';
import { getUserById } from 'redux/user/actions';
import API from 'services/api';
import { getError, groupByDate } from 'utils';
import history from 'utils/history';
import { token } from 'utils/user_persist';
import AccountsActions from './types';

/**
 * @namespace dispatch
 */

/**
 * Get all staffs
 * @function
 * @param {String} searchQuery
 * @param {Number} pageNumber
 * @param {token} tokenId
 */
export const getStaffs = ({
	searchQuery,
	pageNumber = 1,
	tokenId,
	url,
} = {}) => {
	return async (dispatch) => {
		dispatch({ type: AccountsActions.GET_STAFF, payload: { loading: true } });
		const options = API.options('GET', token || tokenId, {});
		try {
			let response;
			if (url) {
				response = await API.request(url, options, true);
			} else {
				response = searchQuery
					? await API.request(`/accounts/users?search=${searchQuery}`, options)
					: await API.request(`/accounts/users?page=${pageNumber}`, options);
			}

			await dispatch({
				type: AccountsActions.GET_STAFF,
				payload: { loading: false, data: response.data },
			});
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: AccountsActions.GET_STAFF,
				payload: { loading: false },
			});
		}
	};
};

export const getCompanyById = (Id) => {
	return async (dispatch) => {
		dispatch({
			type: AccountsActions.GET_COMPANY_BY_ID,
			payload: { loading: true },
		});
		const options = API.options('GET', token, {});
		try {
			const response = await API.request(`/company/${Id}`, options);

			await dispatch({
				type: AccountsActions.GET_COMPANY_BY_ID,
				payload: {
					loading: false,
					data: {
						company: response?.data?.company,
						activity: groupByDate(response?.data?.activity),
					},
				},
			});
			return response?.data?.company;
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: AccountsActions.GET_COMPANY_BY_ID,
				payload: { loading: false },
			});
		}
	};
};

export const deleteCompany = (Id) => {
	return async (dispatch) => {
		dispatch({
			type: AccountsActions.DELETE_COMPANY,
			payload: { loading: true },
		});
		const options = API.options('DELETE', token, {});
		try {
			await API.request(`/company/${Id}/`, options);

			await dispatch({
				type: AccountsActions.DELETE_COMPANY,
				payload: {
					loading: false,
				},
			});
			dispatch(
				setAlert(`Company deleted successfully, Redirecting...`, 'success')
			);
			await sleep(500);
			history.push('/dashboard/companies');
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: AccountsActions.DELETE_COMPANY,
				payload: { loading: false },
			});
		}
	};
};

/**
 * Get all companes
 * @function
 * @param {String} searchQuery
 * @param {Number} pageNumber
 * @param {token} tokenId
 */
export const getCompanies = ({
	searchQuery,
	pageNumber = 1,
	tokenId,
	url = null,
} = {}) => {
	return async (dispatch) => {
		dispatch({ type: AccountsActions.GET_COMPANY, payload: { loading: true } });
		const options = API.options('GET', token || tokenId, {});
		try {
			let response;
			if (url) {
				response = await API.request(url, options, true);
			} else {
				response = searchQuery
					? await API.request(`/company?search=${searchQuery}`, options)
					: await API.request(`/company?page=${pageNumber}`, options);
			}

			await dispatch({
				type: AccountsActions.GET_COMPANY,
				payload: { loading: false, data: response.data },
			});
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: AccountsActions.GET_COMPANY,
				payload: { loading: false },
			});
		}
	};
};
/**
 * Get all companes
 * @function
 * @param {String} searchQuery
 * @param {Number} pageNumber
 * @param {token} tokenId
 */
export const filterCompanies = (slug) => {
	return async (dispatch) => {
		dispatch({ type: AccountsActions.GET_COMPANY, payload: { loading: true } });
		const options = API.options('GET', token, {});
		try {
			const response = await API.request(`/company/filter/${slug}/`, options);

			await dispatch({
				type: AccountsActions.GET_COMPANY,
				payload: { loading: false, data: response.data },
			});
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: AccountsActions.GET_COMPANY,
				payload: { loading: false },
			});
		}
	};
};
/**
 * Get all companes
 * @function
 * @param {String} searchQuery
 * @param {Number} pageNumber
 * @param {token} tokenId
 */
export const getCompanyAudit = (searchQuery, pageNumber = 1, tokenId) => {
	return async (dispatch) => {
		dispatch({ type: AccountsActions.GET_COMPANY, payload: { loading: true } });
		const options = API.options('GET', token || tokenId, {});
		try {
			const response = searchQuery
				? await API.request(`/company?search=${searchQuery}`, options)
				: await API.request(`/company?page=${pageNumber}`, options);

			await dispatch({
				type: AccountsActions.GET_COMPANY,
				payload: { loading: false, data: response.data },
			});
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: AccountsActions.GET_COMPANY,
				payload: { loading: false },
			});
		}
	};
};
/**
 * Get all staff activity
 * @function
 * @param {Number} pageNumber
 */
export const getStaffAudit = (Url) => {
	return async (dispatch) => {
		dispatch({
			type: AccountsActions.GET_STAFF_AUDIT,
			payload: { loading: true },
		});
		const options = API.options('GET', token, {});
		try {
			const response = !Url
				? await API.request(`/audit-log/staff/?page=1`, options)
				: await API.request(Url, options, true);

			await dispatch({
				type: AccountsActions.GET_STAFF_AUDIT,
				payload: { loading: false, data: response.data },
			});
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: AccountsActions.GET_STAFF_AUDIT,
				payload: { loading: false },
			});
		}
	};
};
/**
 * Get all company activity
 * @function
 * @param {Number} pageNumber
 */
export const getCompaniesAudit = (Url) => {
	return async (dispatch) => {
		dispatch({
			type: AccountsActions.GET_COMPANY_AUDIT,
			payload: { loading: true },
		});
		const options = API.options('GET', token, {});
		try {
			const response = !Url
				? await API.request(`/audit-log/company/?page=1`, options)
				: await API.request(Url, options, true);

			await dispatch({
				type: AccountsActions.GET_COMPANY_AUDIT,
				payload: { loading: false, data: response.data },
			});
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: AccountsActions.GET_COMPANY_AUDIT,
				payload: { loading: false },
			});
		}
	};
};

/**
 * Create Staffs on the platform
 * @function
 * @param {Object} data
 * @returns {Function}
 */
export const createStaff = (data) => {
	return async (dispatch) => {
		dispatch({
			type: AccountsActions.CREATE_STAFF,
			payload: { loading: true },
		});
		const options = API.options('POST', token, { data });

		try {
			await API.request('/accounts/users/', options);
			dispatch({
				type: AccountsActions.CREATE_STAFF,
				payload: { loading: false },
			});

			dispatch(
				setAlert(
					`Staff Invitation sent to ${data?.first_name} ${data?.last_name}'s email, Redirecting...`,
					'success'
				)
			);

			Promise.all([dispatch(getStaffs()), dispatch(getStaffAudit())]);
			await sleep(1000);
			history.push('/dashboard/staff');
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: AccountsActions.CREATE_STAFF,
				payload: { loading: false },
			});
			throw err;
		}
	};
};
/**
 * Edit Company on the platform
 * @function
 * @param {Object} data
 * @returns {Function}
 */
export const editCompany = (id, data) => {
	return async (dispatch) => {
		dispatch({
			type: AccountsActions.EDIT_COMPANY,
			payload: { loading: true },
		});
		const options = API.options('PATCH', token, { data });

		try {
			await API.request(`/company/${id}/`, options);
			dispatch({
				type: AccountsActions.EDIT_COMPANY,
				payload: { loading: false },
			});

			dispatch(
				setAlert(
					`You have successfully updated ${data?.name}, Redirecting...`,
					'success'
				)
			);

			Promise.all([dispatch(getCompanies()), dispatch(getCompaniesAudit())]);
			await sleep(1000);
			history.push('/dashboard/companies');
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: AccountsActions.EDIT_COMPANY,
				payload: { loading: false },
			});
			throw err;
		}
	};
};
/**
 * Create Company on the platform
 * @function
 * @param {Object} data
 * @returns {Function}
 */
export const createCompany = (data) => {
	return async (dispatch) => {
		dispatch({
			type: AccountsActions.CREATE_COMPANY,
			payload: { loading: true },
		});
		const options = API.options('POST', token, { data });

		try {
			const response = await API.request('/company/', options);

			dispatch({
				type: AccountsActions.CREATE_COMPANY,
				payload: { loading: false },
			});

			dispatch(
				setAlert('Company created successfully, Redirecting...', 'success')
			);
			Promise.all([
				dispatch(getCompanies()),
				dispatch(getUserById()),
				dispatch(getUserById(null, true)),
			]);
			await sleep(1000);
			history.push(
				`/dashboard/companies/create?token=${response?.data?.license?.code}&company=${response?.data?.name}`
			);

			return dispatch(getStaffs());
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: AccountsActions.CREATE_COMPANY,
				payload: { loading: false },
			});
			throw err;
		}
	};
};
