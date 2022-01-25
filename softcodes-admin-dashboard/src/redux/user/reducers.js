/* --------------------------- Internal Dependency -------------------------- */
import UserActions from './types';

export const initialState = {
	currentUser: {},
	isLoading: false,
	error: false,
	errorMessage: '',
	dashboardActiviy: [],
	fetchedUser: {},
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
		case UserActions.EDIT_STAFF: {
			return {
				...state,
				isLoading: payload.loading,
			};
		}
		case UserActions.GET_USER_BY_ID: {
			return {
				...state,
				isLoading: payload.loading,
				fetchedUser: payload.data,
			};
		}

		case UserActions.GET_DASHBOARD_USER: {
			return {
				...state,
				isLoading: payload.loading,
				dashboardActiviy: payload.data,
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
