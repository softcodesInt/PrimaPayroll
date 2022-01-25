/* --------------------------- Internal Dependency -------------------------- */
import CompanyStructureActions from './types';

export const initialState = {
	head: {},
	items: {},
	isLoadingHead: false,
	isLoadingItem: false,
	currentHead: {},
	isLoading: false,
};

const companyStructureReducer = (state = initialState, action) => {
	const { type, payload } = action;

	const FAIL_RESPONSE = {
		...state,
		isLoadingHead: false,
		isLoadingItem: false,
	};

	switch (type) {
		case CompanyStructureActions.ADD_HEAD_OR_ITEM: {
			return {
				...state,
				isLoading: payload.loading,
			};
		}
		case CompanyStructureActions.GET_BY_ID: {
			return {
				...state,
				isLoadingHead: payload.loading,
				currentHead: payload.data,
			};
		}
		case CompanyStructureActions.GET_ALL_COMPANY_STRUCTURE: {
			return {
				...state,
				isLoadingAll: payload.loading,
				all: payload.data || state?.all,
			};
		}
		case CompanyStructureActions.GET_HEAD: {
			return {
				...state,
				isLoadingHead: payload.loading,
				head: payload.data || state?.head,
			};
		}
		case CompanyStructureActions.GET_ITEM: {
			return {
				...state,
				isLoadingItem: payload.loading,
				items: payload.data || state.items,
			};
		}

		case CompanyStructureActions.GET_ERROR: {
			return FAIL_RESPONSE;
		}

		default:
			return { ...state };
	}
};

export default companyStructureReducer;
