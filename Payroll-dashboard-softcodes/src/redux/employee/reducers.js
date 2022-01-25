/* --------------------------- Internal Dependency -------------------------- */
import EmployeeStructure from './types';

export const initialState = {
	employees: {},
	employee: {},
	isLoading: false,
	payslips: {},
};

const settingsStructureReducer = (state = initialState, action) => {
	const { type, payload } = action;

	const FAIL_RESPONSE = {
		...state,
		isLoading: false,
		isLoadingCategory: false,
	};

	switch (type) {
		case EmployeeStructure.ADD_EMPLOYEE: {
			return {
				...state,
				isLoading: payload.loading,
			};
		}
		case EmployeeStructure.GET_EMPLOYEES: {
			return {
				...state,
				isLoading: payload.loading,
				employees: payload.data || state.employees,
			};
		}

		case EmployeeStructure.GET_EMPLOYEE_PAYSLIP: {
			return {
				...state,
				isLoading: payload.loading,
				payslips: payload.data || state.payslips,
			};
		}
		case EmployeeStructure.EDIT_EMPLOYEE: {
			return {
				...state,
				isLoading: payload.loading,
			};
		}
		case EmployeeStructure.DEACTIVATE_EMPLOYEE: {
			return {
				...state,
				isLoading: payload.loading,
			};
		}
		case EmployeeStructure.GET_EMPLOYEE: {
			return {
				...state,
				isLoading: payload.loading,
				employee: payload.data || state.employee,
			};
		}
		case EmployeeStructure.GET_ERROR: {
			return FAIL_RESPONSE;
		}

		default:
			return { ...state };
	}
};

export default settingsStructureReducer;
