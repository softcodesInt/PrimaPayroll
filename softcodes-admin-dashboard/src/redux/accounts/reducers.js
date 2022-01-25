/* --------------------------- Internal Dependency -------------------------- */
import UserActions from './types';

export const initialState = {
	currentUser: {},
	isLoading: false,
	companies: [],
	audit_log: [],
	isAuditLoading: false,
	staffs: [],
	staff_audit: {},
	company_audit: {},
	isStaffLoading: false,
	isCompanyLoading: false,
	currentCompany: {
		company: {},
		activity: [],
	},
};

const accountsReducer = (state = initialState, action) => {
	const { type, payload } = action;

	switch (type) {
		case UserActions.CREATE_STAFF: {
			return {
				...state,
				isLoading: payload.loading,
			};
		}
		case UserActions.CREATE_COMPANY: {
			return {
				...state,
				isLoading: payload.loading,
			};
		}
		case UserActions.EDIT_COMPANY: {
			return {
				...state,
				isCompanyLoading: payload.loading,
			};
		}
		case UserActions.EDIT_STAFF: {
			return {
				...state,
				isLoading: payload.loading,
			};
		}
		case UserActions.GET_COMPANY_BY_ID: {
			return {
				...state,
				isCompanyLoading: payload.loading,
				currentCompany: payload.data,
			};
		}
		case UserActions.GET_COMPANY_AUDIT: {
			return {
				...state,
				isLoading: payload.loading,
				company_audit: payload.data,
			};
		}
		case UserActions.GET_STAFF_AUDIT: {
			return {
				...state,
				isLoading: payload.loading,
				staff_audit: payload.data,
			};
		}
		case UserActions.DELETE_COMPANY: {
			return {
				...state,
				isCompanyLoading: payload.loading,
			};
		}
		case UserActions.GET_COMPANY: {
			return {
				...state,
				isCompanyLoading: payload.loading,
				companies: payload.data,
			};
		}
		case UserActions.GET_STAFF: {
			return {
				...state,
				isStaffLoading: payload.loading,
				staffs: payload.data,
			};
		}

		case UserActions.GET_AUDIT_LOG: {
			return {
				...state,
				isAuditLoading: payload.loading,
				audit_log: payload.data,
			};
		}

		default:
			return { ...state };
	}
};

export default accountsReducer;
