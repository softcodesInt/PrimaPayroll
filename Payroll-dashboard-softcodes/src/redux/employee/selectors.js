/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import { createSelector } from 'reselect';

const selectSettings = (state) => state.employees;

export const selectisLoading = createSelector(
	[selectSettings],
	(structure) => structure.isLoading
);
export const selectAllEmployees = createSelector(
	[selectSettings],
	(structure) => structure?.employees
);

export const selectEmployee = createSelector(
	[selectSettings],
	(structure) => structure?.employee
);

export const selectEmployeePayslip = createSelector(
	[selectSettings],
	(structure) => structure?.payslips
);
