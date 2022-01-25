/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import { createSelector } from 'reselect';

const selectSettings = (state) => state.settings;

export const selectisLoading = createSelector(
	[selectSettings],
	(structure) => structure.isLoading
);
export const selectAllBanks = createSelector(
	[selectSettings],
	(structure) => structure?.banks
);

export const selectAllJobTitles = createSelector(
	[selectSettings],
	(structure) => structure?.jobTitles
);

export const selectAllNatureOfContracts = createSelector(
	[selectSettings],
	(structure) => structure?.natureOfContracts
);

export const selectAllJobGrades = createSelector(
	[selectSettings],
	(structure) => structure?.jobGrades
);

export const selectAllTerminateReasons = createSelector(
	[selectSettings],
	(structure) => structure?.terminateReasons
);

export const selectAllReinstateReasons = createSelector(
	[selectSettings],
	(structure) => structure?.reinstateReason
);

export const selectPensionSetting = createSelector(
	[selectSettings],
	(structure) => structure?.pensionSetting
);
