/* --------------------------- Internal Dependency -------------------------- */
import SubsidiaryStructureActions from './types';

export const initialState = {
	subsidiaries: {},
	isLoading: false,
	currentSubsidiary: {},
};

const subsidiaryStructureReducer = (state = initialState, action) => {
	const { type, payload } = action;

	const FAIL_RESPONSE = {
		...state,
		isLoading: false,
		isLoadingCategory: false,
	};

	switch (type) {
		case SubsidiaryStructureActions.ADD_SUBSIDIARY: {
			return {
				...state,
				isLoading: payload.loading,
			};
		}

		case SubsidiaryStructureActions.GET_BY_ID: {
			return {
				...state,
				isLoading: payload.loading,
				currentSubsidiary: payload.data,
			};
		}
		case SubsidiaryStructureActions.GET_SUBSIDIARY: {
			return {
				...state,
				isLoading: payload.loading,
				subsidiaries: payload.data || state.subsidiaries,
			};
		}

		case SubsidiaryStructureActions.EDIT_SUBSIDIARY: {
			return {
				...state,
				isLoading: payload.loading,
			};
		}
		case SubsidiaryStructureActions.DEACTIVATE_SUBSIDIARY: {
			return {
				...state,
				isLoading: payload.loading,
			};
		}

		case SubsidiaryStructureActions.GET_ERROR: {
			return FAIL_RESPONSE;
		}

		default:
			return { ...state };
	}
};

export default subsidiaryStructureReducer;
