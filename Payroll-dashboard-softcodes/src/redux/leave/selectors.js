/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import { createSelector } from 'reselect';

const selectLeaveStur = (state) => state.leave_structure;

export const selectisLoading = createSelector(
	[selectLeaveStur],
	(structure) => structure.isLoading
);
export const selectisLoadingCategory = createSelector(
	[selectLeaveStur],
	(structure) => structure.isLoadingCategory
);
export const selectCurrentLeave = createSelector(
	[selectLeaveStur],
	(structure) => structure?.currentLeave
);
export const selectAllLeaves = createSelector(
	[selectLeaveStur],
	(structure) => structure?.leaves
);
export const selectAllCategories = createSelector(
	[selectLeaveStur],
	(structure) => structure?.categories
);
export const selectEmployeeAvailableLeaves = createSelector(
	[selectLeaveStur],
	(structure) => structure?.employeeLeaves
);

export const selectEmployeeWorkflowLoading = createSelector(
	[selectLeaveStur],
	(structure) => structure?.isSavingLoading
);

export const selectEmployeesLeaveRequests = createSelector(
	[selectLeaveStur],
	(structure) => structure?.employeeLeaveRequest
);
