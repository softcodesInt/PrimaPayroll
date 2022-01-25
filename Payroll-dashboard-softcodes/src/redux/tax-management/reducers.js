/* --------------------------- Internal Dependency -------------------------- */
import TaxManagementActions from './types';

export const initialState = {
	taxReliefGroups: {},
	isLoadingGroups: false,
	taxReliefs: {},
	isLoading: false,
};

const taxManagementStructureReducer = (state = initialState, action) => {
	const { type, payload } = action;

	const FAIL_RESPONSE = {
		...state,
		isLoadingGroups: false,
		isLoading: false,
	};

	switch (type) {
		case TaxManagementActions.ADD_TAX_RELIEF_GROUP:
		case TaxManagementActions.EDIT_TAX_RELIEF_GROUP:
		case TaxManagementActions.DEACTIVATE_TAX_RELIEF_GROUP: {
			return {
				...state,
				isLoadingGroups: payload.loading,
			};
		}
		case TaxManagementActions.GET_TAX_RELIEF_GROUP: {
			return {
				...state,
				isLoadingGroups: payload.loading,
				taxReliefGroups: payload.data || state.taxReliefGroups,
			};
		}

		case TaxManagementActions.ADD_TAX_RELIEF:
		case TaxManagementActions.EDIT_TAX_RELIEF:
		case TaxManagementActions.DEACTIVATE_TAX_RELIEF: {
			return {
				...state,
				isLoading: payload.loading,
			};
		}
		case TaxManagementActions.GET_TAX_RELIEF: {
			return {
				...state,
				isLoading: payload.loading,
				taxReliefs: payload.data || state.taxReliefs,
			};
		}

		case TaxManagementActions.GET_ERROR: {
			return FAIL_RESPONSE;
		}

		default:
			return { ...state };
	}
};

export default taxManagementStructureReducer;
