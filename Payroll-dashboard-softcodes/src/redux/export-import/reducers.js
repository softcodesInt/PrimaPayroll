/* --------------------------- Internal Dependency -------------------------- */
import ExportImportStructure from './types';

export const initialState = {
	exportFile: {},
	isLoading: false,
	currentSubsidiary: {},
};

const exportImportReducer = (state = initialState, action) => {
	const { type, payload } = action;

	const FAIL_RESPONSE = {
		...state,
		isLoading: false,
	};

	switch (type) {
		case ExportImportStructure.EXPORT: {
			return {
				...state,
				isLoading: payload.loading,
				exportFile: payload.data,
			};
		}

		case ExportImportStructure.GET_ERROR: {
			return FAIL_RESPONSE;
		}

		default:
			return { ...state };
	}
};

export default exportImportReducer;
