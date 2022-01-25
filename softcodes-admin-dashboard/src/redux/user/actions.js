/* -------------------------- Internal Dependencies ------------------------- */
import {
	clearState,
	setState,
} from 'codewonders-helpers/bundle-cjs/helpers/localstorage';
import { getStaffs } from 'redux/accounts/actions';
import { setAlert } from 'redux/alert/actions';
import API from 'services/api';
import { getError, groupByDate, sleep } from 'utils';
import history from 'utils/history';
import { user_id, token } from 'utils/user_persist';
import UserActions from './types';

/**
 * @namespace dispatch
 */

/**
 * Sign in user into the platform
 * @function
 * @param {Object} data
 * @returns {Function}
 */
export const signInUser = (data) => {
	return async (dispatch) => {
		dispatch({ type: UserActions.SIGN_IN });
		const options = API.options('POST', {}, { data });

		try {
			const response = await API.request('/accounts/login/', options);
			dispatch({
				type: UserActions.SIGN_IN_SUCCESS,
			});

			await setState('SOFT_TOKEN', response.data.token);
			await setState('SOFT_ID', response.data.user?.id);
			dispatch(getCurrentUser(response.data.token));
			dispatch(setAlert('Login Successfully, Welcome to Primerfit', 'success'));
			history.go();
			return false;
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: UserActions.SIGN_IN_FAIL,
			});
			throw err;
		}
	};
};

/**
 * @function
 * @param { user_id } tokenId // Get userId from state
 */
export const getCurrentUser = (tokenId) => {
	return async (dispatch) => {
		dispatch({ type: UserActions.GET_USER, payload: { loading: true } });
		const options = API.options('GET', token || tokenId, {});
		try {
			const response = await API.request(`/accounts/profile`, options);

			await dispatch({
				type: UserActions.GET_USER,
				payload: { loading: false, data: response.data?.user },
			});
		} catch (err) {
			getError(dispatch, err);
			await dispatch({ type: UserActions.GET_USER_ERROR, payload: err });
		}
	};
};
export const getUserById = (Id, isDashboard = false) => {
	return async (dispatch) => {
		dispatch({ type: UserActions.GET_USER_BY_ID, payload: { loading: true } });
		const options = API.options('GET', token, {});
		try {
			const response = await API.request(
				`/accounts/users/${Id || user_id}`,
				options
			);

			if (!isDashboard) {
				await dispatch({
					type: UserActions.GET_USER_BY_ID,
					payload: {
						loading: false,
						data: {
							...response?.data,
							activity: groupByDate(
								[
									...response.data?.company_activity,
									...response.data?.staff_activity,
								].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
							),
						},
					},
				});
				return response?.data?.user;
			} else {
				await dispatch({
					type: UserActions.GET_DASHBOARD_USER,
					payload: {
						loading: false,
						data: groupByDate(
							[
								...response.data?.company_activity,
								...response.data?.staff_activity,
							].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
						),
					},
				});
			}
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: UserActions.GET_USER_BY_ID,
				payload: { loading: false },
			});
		}
	};
};
export const getAuditLog = (url) => {
	return async (dispatch) => {
		dispatch({ type: UserActions.GET_USER_BY_ID, payload: { loading: true } });
		const options = API.options('GET', token, {});
		try {
			const response = await API.request(
				!url ? `/audit-log/?limit=2?offset=0` : url,
				options,
				url
			);

			await dispatch({
				type: UserActions.GET_DASHBOARD_USER,
				payload: {
					loading: false,
					data: {
						...response?.data,
						activity: groupByDate(
							[
								...response.data?.results?.CompanyLog,
								...response.data?.results?.StaffLog,
							].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
						),
					},
				},
			});
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: UserActions.GET_USER_BY_ID,
				payload: { loading: false },
			});
		}
	};
};

export const editStaff = (Id, data) => {
	return async (dispatch) => {
		dispatch({ type: UserActions.EDIT_STAFF, payload: { loading: true } });
		const options = API.options('PATCH', token, { data });
		try {
			const response = await API.request(`/accounts/users/${Id}/`, options);
			await dispatch({
				type: UserActions.EDIT_STAFF,
				payload: {
					loading: false,
					data: response?.data,
				},
			});

			await Promise.all([
				dispatch(getUserById(Id)),
				dispatch(getCurrentUser()),
				dispatch(getStaffs()),
			]);

			return dispatch(
				setAlert(`User updated successfully, You can go back.`, 'success')
			);
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: UserActions.EDIT_STAFF,
				payload: { loading: false },
			});
		}
	};
};

export const deleteStaff = (Id) => {
	return async (dispatch) => {
		dispatch({ type: UserActions.EDIT_STAFF, payload: { loading: true } });
		const options = API.options('DELETE', token, {});
		try {
			await API.request(`/accounts/users/${Id}/`, options);
			await dispatch({
				type: UserActions.EDIT_STAFF,
				payload: {
					loading: false,
				},
			});
			dispatch(
				setAlert(`User deleted successfully, Redirecting...`, 'success')
			);
			await sleep(500);
			history.push('/dashboard/staff');
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: UserActions.EDIT_STAFF,
				payload: { loading: false },
			});
		}
	};
};
/**
 * @function
 * @param {String} data
 */
export const forgotPassword = (data) => {
	return async (dispatch) => {
		dispatch({ type: UserActions.FORGOT_PASSWORD });
		const options = API.options('POST', {}, { data });
		try {
			await API.request(`/password-reset/`, options);

			await dispatch({
				type: UserActions.FORGOT_PASSWORD_SUCCESS,
			});
			dispatch(
				setAlert(
					`A password reset link has been sent to your email (${data?.email}) check your email.`,
					'success'
				)
			);
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: UserActions.FORGOT_PASSWORD_FAIL,
				payload: { errorMessage: err },
			});
		}
	};
};

/**
 * Reset Password
 * @param {Object} data
 * @returns {Function}
 */
export const resetPassword = (data) => {
	return async (dispatch) => {
		dispatch({ type: UserActions.RESET_PASSWORD });
		const options = API.options('POST', {}, { data });
		try {
			await API.request(`/password-reset/confirm/`, options);

			await dispatch({
				type: UserActions.RESET_PASSWORD_SUCCESS,
			});
			dispatch(
				setAlert(`Set up password sucessful, Redirecting...`, 'success')
			);
			await sleep(500);
			history.push('/');
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: UserActions.RESET_PASSWORD_FAIL,
				payload: { errorMessage: err },
			});
		}
	};
};

/**
 * Logs User Out and deletes data from storage
 * @param {*} data
 * @returns {Window}
 */
export const logOutUser = (data) => {
	return async (dispatch) => {
		dispatch({ type: UserActions.LOGOUT_USER, payload: null });
		const options = API.options('POST', token, {});
		try {
			await API.request('/accounts/logout/', options);

			dispatch(setAlert('Logout Successfully', 'success'));
			await sleep(300);
			window.location.assign('/');
			return clearState();
		} catch (err) {
			dispatch(
				setAlert('Your token has expired, We are logging you out.', 'error')
			);
			clearState();
			window.location.assign('/');
		}
	};
};
