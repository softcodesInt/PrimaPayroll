/* -------------------------- Internal Dependencies ------------------------- */
import {
	clearState,
	setState,
} from 'codewonders-helpers/bundle-cjs/helpers/localstorage';
import { setAlert } from 'redux/alert/actions';
import API from 'services/api';
import { getError, sleep } from 'utils';
import history from 'utils/history';
import { token } from 'utils/user_persist';
import UserActions from './types';

export const signInUser = (data) => {
	return async (dispatch) => {
		dispatch({ type: UserActions.SIGN_IN });
		const options = API.options('POST', {}, { data });

		try {
			const response = await API.request('/accounts/login/', options);
			dispatch({
				type: UserActions.SIGN_IN_SUCCESS,
			});

			await setState('SOFT_PAY_TOKEN', response.data.token);
			await setState('SOFT_PAY_ID', response.data.user?.id);
			await setState('SOFT_PAY_LEVEL', response.data.user?.user_level);
			dispatch(getCurrentUser(response.data.token));
			dispatch(setAlert('Login Successfully, Welcome to Primerfit', 'success'));
			if (response.data.user?.user_level === 2) {
				window.location = '/dashboard/ess/me';
			} else {
				history.go();
			}
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

export const activateLicense = (data) => {
	return async (dispatch) => {
		dispatch({
			type: UserActions.ACTIVATE_LICENSE,
			payload: {
				loading: true,
			},
		});
		const options = API.options('POST', {}, { data });

		try {
			const response = await API.request('/company/activate-license/', options);
			dispatch({
				type: UserActions.ACTIVATE_LICENSE,
				payload: {
					loading: false,
					data: response.data,
				},
			});

			dispatch(
				setAlert('License code activated, Welcome to Primerfit', 'success')
			);

			return response.data;
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: UserActions.SIGN_IN_FAIL,
			});
			throw err;
		}
	};
};

export const signUpUser = (data) => {
	return async (dispatch) => {
		dispatch({ type: UserActions.SIGN_IN });
		const options = API.options('POST', {}, { data });

		try {
			await API.request('/accounts/register/', options);
			dispatch({
				type: UserActions.SIGN_IN_SUCCESS,
			});

			dispatch(setAlert('Registration Successful, Redirecting...', 'success'));
			await sleep(500);
			history.push('/');
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

export const getCurrentUser = (tokenId) => {
	return async (dispatch) => {
		dispatch({ type: UserActions.GET_USER, payload: { loading: true } });
		const options = API.options('GET', token || tokenId, {});
		try {
			const response = await API.request(`/accounts/profile`, options);

			await dispatch({
				type: UserActions.GET_USER,
				payload: {
					loading: false,
					data: {
						...response.data?.user,
						company: { ...response.data?.company },
					},
				},
			});
		} catch (err) {
			getError(dispatch, err);
			await dispatch({ type: UserActions.GET_USER_ERROR, payload: err });
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
			await API.request(`/accounts/password-reset/`, options);

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
			await API.request(`/accounts/password-reset/confirm/`, options);

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

export const logOutUser = (data) => {
	return async (dispatch) => {
		dispatch({ type: UserActions.SIGN_OUT, payload: null });
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

export const getAdminUsers = () => {
	return async (dispatch) => {
		dispatch({ type: UserActions.GET_USER_ACCESS, payload: { loading: true } });
		const options = API.options('GET', token, {});
		try {
			const response = await API.request(`/accounts/user-access`, options);

			await dispatch({
				type: UserActions.GET_USER_ACCESS,
				payload: {
					loading: false,
					data: response.data,
				},
			});
		} catch (err) {
			getError(dispatch, err);
			await dispatch({ type: UserActions.GET_USER_ERROR, payload: err });
		}
	};
};

export const createAdminUser = (data) => {
	return async (dispatch) => {
		dispatch({
			type: UserActions.CREATE_USER_ACCESS,
			payload: { loading: true },
		});
		const options = API.options('POST', token, { data });
		try {
			await API.request(`/accounts/user-access/`, options);

			await dispatch({
				type: UserActions.CREATE_USER_ACCESS,
				payload: { loading: false },
			});
			dispatch(setAlert(`Admin User saved successfully`, 'success'));
			dispatch(getAdminUsers());
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: UserActions.GET_USER_ERROR,
				payload: { errorMessage: err },
			});
		}
	};
};

export const editAdminUser = (id, data) => {
	return async (dispatch) => {
		dispatch({
			type: UserActions.EDIT_USER_ACCESS,
			payload: { loading: true },
		});
		const options = API.options('PATCH', token, { data });
		try {
			await API.request(`/accounts/user-access/${id}/`, options);

			await dispatch({
				type: UserActions.EDIT_USER_ACCESS,
				payload: { loading: false },
			});
			dispatch(setAlert(`Admin User updated successfully`, 'success'));
			dispatch(getAdminUsers());
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: UserActions.GET_USER_ERROR,
				payload: { errorMessage: err },
			});
		}
	};
};

export const deactivateAdminUser = (id) => {
	return async (dispatch) => {
		dispatch({
			type: UserActions.EDIT_USER_ACCESS,
			payload: { loading: true },
		});
		const options = API.options('DELETE', token, {});
		try {
			await API.request(`/accounts/user-access/${id}/`, options);

			await dispatch({
				type: UserActions.EDIT_USER_ACCESS,
				payload: { loading: false },
			});
			dispatch(setAlert(`Admin User deactivated successfully`, 'success'));
			dispatch(getAdminUsers());
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: UserActions.GET_USER_ERROR,
				payload: { errorMessage: err },
			});
		}
	};
};
