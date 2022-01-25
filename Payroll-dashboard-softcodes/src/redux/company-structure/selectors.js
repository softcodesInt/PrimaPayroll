/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import { createSelector } from 'reselect';

const selectCompanyStur = (state) => state.company_structure;

export const selectisLoadingHead = createSelector(
	[selectCompanyStur],
	(structure) => structure.isLoadingHead
);

export const selectisLoadingAll = createSelector(
	[selectCompanyStur],
	(structure) => structure.isLoadingAll
);

export const selectisLoadingItem = createSelector(
	[selectCompanyStur],
	(structure) => structure.isLoadingItem
);
export const selectisLoading = createSelector(
	[selectCompanyStur],
	(structure) => structure.isLoading
);

export const selectCurrentHead = createSelector(
	[selectCompanyStur],
	(structure) => structure?.currentHead
);
export const selectAllHeads = createSelector(
	[selectCompanyStur],
	(structure) => structure?.head
);

export const selecAllStructures = createSelector(
	[selectCompanyStur],
	(structure) => structure?.all
);

export const selectAllItems = createSelector(
	[selectCompanyStur],
	(structure) => structure?.items
);
