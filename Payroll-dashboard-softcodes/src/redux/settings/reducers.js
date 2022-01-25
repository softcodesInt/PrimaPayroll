/* --------------------------- Internal Dependency -------------------------- */
import SettingsStructure from './types';

export const initialState = {
	banks: {},
	jobTitles: {},
	natureOfContracts: {},
	jobGrades: {},
	isLoading: false,
	pensionSetting: {},
	terminateReasons: {},
	reinstateReason: {},
};

const settingsStructureReducer = (state = initialState, action) => {
	const { type, payload } = action;

	const FAIL_RESPONSE = {
		...state,
		isLoading: false,
	};

	switch (type) {
		case SettingsStructure.ADD_BANK: {
			return {
				...state,
				isLoading: payload.loading,
			};
		}
		case SettingsStructure.GET_BANKS: {
			return {
				...state,
				isLoading: payload.loading,
				banks: payload.data || state.banks,
			};
		}
		case SettingsStructure.EDIT_BANK: {
			return {
				...state,
				isLoading: payload.loading,
			};
		}
		case SettingsStructure.DEACTIVATE_BANK: {
			return {
				...state,
				isLoading: payload.loading,
			};
		}

		case SettingsStructure.ADD_TERMINATE_REASON: {
			return {
				...state,
				isLoading: payload.loading,
			};
		}
		case SettingsStructure.GET_TERMINATE_REASON: {
			return {
				...state,
				isLoading: payload.loading,
				terminateReasons: payload.data || state.terminateReasons,
			};
		}
		case SettingsStructure.EDIT_TERMINATE_REASON: {
			return {
				...state,
				isLoading: payload.loading,
			};
		}
		case SettingsStructure.DEACTIVATE_TERMINATE_REASON: {
			return {
				...state,
				isLoading: payload.loading,
			};
		}

		case SettingsStructure.ADD_REINSTATE_REASON: {
			return {
				...state,
				isLoading: payload.loading,
			};
		}
		case SettingsStructure.GET_REINSTATE_REASON: {
			return {
				...state,
				isLoading: payload.loading,
				reinstateReason: payload.data || state.reinstateReason,
			};
		}
		case SettingsStructure.EDIT_REINSTATE_REASON: {
			return {
				...state,
				isLoading: payload.loading,
			};
		}
		case SettingsStructure.DEACTIVATE_REINSTATE_REASON: {
			return {
				...state,
				isLoading: payload.loading,
			};
		}

		case SettingsStructure.ADD_JOB_TITLE: {
			return {
				...state,
				isLoading: payload.loading,
			};
		}
		case SettingsStructure.GET_JOB_TITLES: {
			return {
				...state,
				isLoading: payload.loading,
				jobTitles: payload.data || state.banks,
			};
		}
		case SettingsStructure.EDIT_JOB_TITLE: {
			return {
				...state,
				isLoading: payload.loading,
			};
		}
		case SettingsStructure.DEACTIVATE_JOB_TITLE: {
			return {
				...state,
				isLoading: payload.loading,
			};
		}

		case SettingsStructure.ADD_NATURE_OF_CONTRACT: {
			return {
				...state,
				isLoading: payload.loading,
			};
		}
		case SettingsStructure.GET_NATURE_OF_CONTRACTS: {
			return {
				...state,
				isLoading: payload.loading,
				natureOfContracts: payload.data || state.natureOfContracts,
			};
		}
		case SettingsStructure.EDIT_NATURE_OF_CONTRACT: {
			return {
				...state,
				isLoading: payload.loading,
			};
		}
		case SettingsStructure.DEACTIVATE_NATURE_OF_CONTRACT: {
			return {
				...state,
				isLoading: payload.loading,
			};
		}
		case SettingsStructure.ADD_JOB_GRADE: {
			return {
				...state,
				isLoading: payload.loading,
			};
		}
		case SettingsStructure.GET_JOB_GRADES: {
			return {
				...state,
				isLoading: payload.loading,
				jobGrades: payload.data || state.jobGrades,
			};
		}
		case SettingsStructure.EDIT_JOB_GRADES: {
			return {
				...state,
				isLoading: payload.loading,
			};
		}
		case SettingsStructure.DEACTIVATE_JOB_GRADES: {
			return {
				...state,
				isLoading: payload.loading,
			};
		}
		case SettingsStructure.GET_ERROR: {
			return FAIL_RESPONSE;
		}
		case SettingsStructure.GET_PENSION_SETTINGS: {
			return {
				...state,
				isLoading: payload.loading,
				pensionSetting: payload.data || state.pensionSetting,
			};
		}

		default:
			return { ...state };
	}
};

export default settingsStructureReducer;
