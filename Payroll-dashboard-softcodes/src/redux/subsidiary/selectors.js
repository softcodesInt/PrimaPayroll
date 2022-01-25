/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import { createSelector } from 'reselect';

const selectSubsidiaryStur = (state) => state.subsidiary_structure;

export const selectisLoading = createSelector(
	[selectSubsidiaryStur],
	(structure) => structure.isLoading
);
export const selectCurrentSubsidiary = createSelector(
	[selectSubsidiaryStur],
	(structure) => structure?.currentSubsidiary
);
export const selectAllSubsidiaries = createSelector(
	[selectSubsidiaryStur],
	(structure) => structure?.subsidiaries
);
