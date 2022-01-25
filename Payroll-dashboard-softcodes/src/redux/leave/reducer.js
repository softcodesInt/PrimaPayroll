/* --------------------------- Internal Dependency -------------------------- */
import LeaveStructureActions from './types';

export const initialState = {
	leaves: {},
	categories: {},
	isLoading: false,
	currentLeave: {},
	isLoadingCategory: false,
	employeeLeaves: {},
	isSavingLoading: false,
	employeeLeaveRequest: {},
};

const leaveStructureReducer = (state = initialState, action) => {
	const { type, payload } = action;

	const FAIL_RESPONSE = {
		...state,
		isLoading: false,
		isLoadingCategory: false,
		isSavingLoading: false,
	};

	switch (type) {
		case LeaveStructureActions.ADD_LEAVE: {
			return {
				...state,
				isLoading: payload.loading,
			};
		}
		case LeaveStructureActions.ADD_CATEGORY: {
			return {
				...state,
				isLoadingCategory: payload.loading,
			};
		}
		case LeaveStructureActions.GET_BY_ID: {
			return {
				...state,
				isLoading: payload.loading,
				currentLeave: payload.data,
			};
		}
		case LeaveStructureActions.GET_LEAVE: {
			return {
				...state,
				isLoading: payload.loading,
				leaves: payload.data || state.leaves,
			};
		}
		case LeaveStructureActions.GET_CATEGORY: {
			return {
				...state,
				isLoading: payload.loading,
				categories: payload.data || state.categories,
			};
		}
		case LeaveStructureActions.EDIT_CATEGORY: {
			return {
				...state,
				isLoadingCategory: payload.loading,
			};
		}
		case LeaveStructureActions.EDIT_LEAVE: {
			return {
				...state,
				isLoading: payload.loading,
			};
		}
		case LeaveStructureActions.DEACTIVATE_LEAVE: {
			return {
				...state,
				isLoading: payload.loading,
			};
		}
		case LeaveStructureActions.DEACTIVATE_CATEGORY: {
			return {
				...state,
				isLoadingCategory: payload.loading,
			};
		}
		case LeaveStructureActions.GET_EMPLOYEE_AVAILABLE_LEAVE: {
			return {
				...state,
				isLoading: payload.loading,
				employeeLeaves: payload.data,
			};
		}
		case LeaveStructureActions.SAVE_EMPLOYEE_WORKFLOW_LEAVE: {
			return {
				...state,
				isSavingLoading: payload.loading,
			};
		}

		case LeaveStructureActions.GET_EMPLOYEE_LEAVE_REQUEST: {
			return {
				...state,
				isLoading: payload.loading,
				employeeLeaveRequest: payload.data || state.employeeLeaveRequest,
			};
		}
		case LeaveStructureActions.GET_ERROR: {
			return FAIL_RESPONSE;
		}

		default:
			return { ...state };
	}
};

export default leaveStructureReducer;
