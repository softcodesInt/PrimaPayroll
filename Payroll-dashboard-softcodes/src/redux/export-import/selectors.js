/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import { createSelector } from 'reselect';

const exportImportStruc = (state) => state.export_import;

export const selectisLoading = createSelector(
	[exportImportStruc],
	(structure) => structure.isLoading
);
export const selectExportFile = createSelector(
	[exportImportStruc],
	(structure) => structure?.selectExportFile
);
