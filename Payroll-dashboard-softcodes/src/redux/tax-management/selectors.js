/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import { createSelector } from 'reselect';

const selectTaxManagementStruc = (state) => state.taxManagement;

export const selectisLoadingTaxReliefGroup = createSelector(
	[selectTaxManagementStruc],
	(structure) => structure.isLoadingGroups
);
export const selectAllTaxReliefGroups = createSelector(
	[selectTaxManagementStruc],
	(structure) => structure.taxReliefGroups
);

export const selectisLoadingTaxRelief = createSelector(
	[selectTaxManagementStruc],
	(structure) => structure.isLoading
);
export const selectAllTaxRelief = createSelector(
	[selectTaxManagementStruc],
	(structure) => structure.taxReliefs
);
