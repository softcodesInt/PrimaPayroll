/* --------------------------- Internal Dependency -------------------------- */
import PayrollStructureActions from './types';

export const initialState = {
	payroll: {},
	categories: {},
	isLoading: false,
	currentPayroll: {},
	remunerations: {},
	remuneration: {},
	isLoadingCategory: false,
	payPeriods: {},
	transactions: {},
	employeeDrivenTaxRelief: {},
	payrollReadyForTransaction: null,
	employeeDrivenPayroll: {},
	loans: {},
};

const leaveStructureReducer = (state = initialState, action) => {
	const { type, payload } = action;

	const FAIL_RESPONSE = {
		...state,
		isLoading: false,
		isLoadingCategory: false,
	};

	switch (type) {
		case PayrollStructureActions.ADD_PAYROLL: {
			return {
				...state,
				isLoading: payload.loading,
			};
		}
		case PayrollStructureActions.ADD_CATEGORY: {
			return {
				...state,
				isLoadingCategory: payload.loading,
			};
		}
		case PayrollStructureActions.GET_BY_ID: {
			return {
				...state,
				isLoading: payload.loading,
				currentPayroll: payload.data,
			};
		}
		case PayrollStructureActions.GET_PAYROLL: {
			return {
				...state,
				isLoading: payload.loading,
				payroll: payload.data,
			};
		}
		case PayrollStructureActions.GET_REMUNERATION: {
			return {
				...state,
				isLoading: payload.loading,
				remunerations: payload.data,
			};
		}
		case PayrollStructureActions.GET_TRANSACTION: {
			return {
				...state,
				isLoading: payload.loading,
				transactions: payload.data,
			};
		}
		case PayrollStructureActions.GET_REMUNERATION_BY_ID: {
			return {
				...state,
				isLoading: payload.loading,
				remuneration: payload.data,
			};
		}
		case PayrollStructureActions.GET_CATEGORY: {
			return {
				...state,
				isLoadingCategory: payload.loading,
				categories: payload.data || state.categories,
			};
		}

		case PayrollStructureActions.GET_PAY_PERIOD: {
			return {
				...state,
				isLoading: payload.loading,
				payPeriods: payload.data || state.payPeriods,
			};
		}

		case PayrollStructureActions.GET_EMPLOYEE_DRIVEN_TAX: {
			return {
				...state,
				isLoading: payload.loading,
				employeeDrivenTaxRelief: payload.data,
			};
		}

		case PayrollStructureActions.GET_EMPLOYEE_DRIVEN_PAYROLL: {
			return {
				...state,
				isLoading: payload.loading,
				employeeDrivenPayroll: payload.data,
			};
		}

		case PayrollStructureActions.ACTIVATE_PAY_PERIOD: {
			return {
				...state,
				isLoading: payload.loading,
				payPeriods: state.payPeriods,
			};
		}

		case PayrollStructureActions.EDIT_CATEGORY: {
			return {
				...state,
				isLoadingCategory: payload.loading,
			};
		}
		case PayrollStructureActions.EDIT_PAYROLL: {
			return {
				...state,
				isLoading: payload.loading,
			};
		}
		case PayrollStructureActions.DEACTIVATE_PAYROLL: {
			return {
				...state,
				isLoading: payload.loading,
			};
		}
		case PayrollStructureActions.DEACTIVATE_CATEGORY: {
			return {
				...state,
				isLoadingCategory: payload.loading,
			};
		}
		case PayrollStructureActions.GET_PAYROLL_READY_FOR_TRANSACTION: {
			return {
				...state,
				payrollReadyForTransaction: payload.data,
			};
		}

		case PayrollStructureActions.GET_LOANS: {
			return {
				...state,
				isLoading: payload.loading,
				loans: payload.data,
			};
		}

		case PayrollStructureActions.ADD_LOAN: {
			return {
				...state,
				isLoading: payload.loading,
			};
		}

		case PayrollStructureActions.GET_ERROR: {
			return FAIL_RESPONSE;
		}

		default:
			return { ...state };
	}
};

export default leaveStructureReducer;
