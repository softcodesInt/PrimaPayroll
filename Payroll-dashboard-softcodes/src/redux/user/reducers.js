/* --------------------------- Internal Dependency -------------------------- */
import { getState } from 'codewonders-helpers/bundle-cjs/helpers/localstorage';
import UserActions from './types';

export const initialState = {
	currentUser: {},
	isLoading: false,
	error: false,
	errorMessage: '',
	dashboardActiviy: [],
	fetchedCompany: getState('company__activated') || {},
	users: {},
};

const userReducer = (state = initialState, action) => {
	const { type, payload } = action;

	const FAIL_RESPONSE = {
		...state,
		isLoading: false,
		error: true,
		errorMessage: payload ? payload.errorMessage : 'Error has occured',
	};

	switch (type) {
		case UserActions.SIGN_IN: {
			return { ...state, isLoading: true };
		}
		case UserActions.SIGN_IN_SUCCESS: {
			return { ...state, isLoading: false };
		}
		case UserActions.GET_USER: {
			return {
				...state,
				isLoading: payload.loading,
				currentUser: payload.data || state.currentUser,
			};
		}

		case UserActions.ACTIVATE_LICENSE: {
			return {
				...state,
				isLoading: payload.loading,
				fetchedCompany: payload.data,
			};
		}

		case UserActions.GET_USER_ACCESS: {
			return {
				...state,
				isLoading: payload.loading,
				users: payload.data,
			};
		}

		case UserActions.CREATE_USER_ACCESS: {
			return {
				...state,
				isLoading: payload.loading,
			};
		}

		case UserActions.GET_USER_ERROR:
		case UserActions.RESET_PASSWORD_FAIL:
		case UserActions.FORGOT_PASSWORD_FAIL:
		case UserActions.SIGN_IN_FAIL: {
			return FAIL_RESPONSE;
		}

		case UserActions.RESET_PASSWORD: {
			return { ...state, isLoading: true };
		}

		case UserActions.RESET_PASSWORD_SUCCESS: {
			return { ...state, isLoading: false };
		}

		case UserActions.FORGOT_PASSWORD: {
			return { ...state, isLoading: true };
		}

		case UserActions.FORGOT_PASSWORD_SUCCESS: {
			return { ...state, isLoading: false };
		}

		default:
			return { ...state };
	}
};

export default userReducer;
