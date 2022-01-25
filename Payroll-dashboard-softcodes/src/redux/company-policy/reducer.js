/* --------------------------- Internal Dependency -------------------------- */
import CompanyPolicyStructureActions from './types';

export const initialState = {
	company_policies: {},
	isLoadingCompanyPolicy: false,
	holidays: {},
	isLoadingHolidays: false,
	tax_table: {},
	isLoadingTaxTable: false,
	pay_period: {},
	isLoading: false,
};

const companyPolicyStructureReducer = (state = initialState, action) => {
	const { type, payload } = action;

	const FAIL_RESPONSE = {
		...state,
		isLoading: false,
		isLoadingCompanyPolicy: false,
		isLoadingHolidays: false,
		isLoadingTaxTable: false,
	};

	switch (type) {
		case CompanyPolicyStructureActions.ADD_COMPANY_POLICY:
		case CompanyPolicyStructureActions.EDIT_COMPANY_POLICY:
		case CompanyPolicyStructureActions.DEACTIVATE_COMPANY_POLICY: {
			return {
				...state,
				isLoadingCompanyPolicy: payload.loading,
			};
		}
		case CompanyPolicyStructureActions.ADD_TAX_TABLE:
		case CompanyPolicyStructureActions.EDIT_TAX_TABLE:
		case CompanyPolicyStructureActions.DEACTIVATE_TAX_TABLE: {
			return {
				...state,
				isLoadingTaxTable: payload.loading,
			};
		}
		case CompanyPolicyStructureActions.ADD_HOLIDAYS:
		case CompanyPolicyStructureActions.EDIT_HOLIDAYS:
		case CompanyPolicyStructureActions.DEACTIVATE_HOLIDAYS: {
			return {
				...state,
				isLoadingHolidays: payload.loading,
			};
		}

		case CompanyPolicyStructureActions.GET_COMPANY_POLICY: {
			return {
				...state,
				isLoadingCompanyPolicy: payload.loading,
				company_policies: payload.data || state.company_policies,
			};
		}
		case CompanyPolicyStructureActions.GET_HOLIDAYS: {
			return {
				...state,
				isLoadingHolidays: payload.loading,
				holidays: payload.data || state.holidays,
			};
		}
		case CompanyPolicyStructureActions.GET_TAX_TABLE: {
			return {
				...state,
				isLoadingTaxTable: payload.loading,
				tax_table: payload.data || state.tax_table,
			};
		}
		case CompanyPolicyStructureActions.GET_PAY_PERIOD: {
			return {
				...state,
				isLoading: payload.loading,
				pay_period: payload.data || state.pay_period,
			};
		}

		case CompanyPolicyStructureActions.GET_ERROR: {
			return FAIL_RESPONSE;
		}

		default:
			return { ...state };
	}
};

export default companyPolicyStructureReducer;
