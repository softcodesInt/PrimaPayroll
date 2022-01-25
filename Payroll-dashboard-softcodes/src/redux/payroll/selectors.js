/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import { createSelector } from 'reselect';

const selectPayrollStur = (state) => state.payroll_structure;

export const selectisLoading = createSelector(
	[selectPayrollStur],
	(structure) => structure.isLoading
);
export const selectisLoadingCategory = createSelector(
	[selectPayrollStur],
	(structure) => structure.isLoadingCategory
);
export const selectCurrentPayroll = createSelector(
	[selectPayrollStur],
	(structure) => structure?.currentPayroll
);
export const selectAllPayroll = createSelector(
	[selectPayrollStur],
	(structure) => structure?.payroll
);
export const selectAllCategories = createSelector(
	[selectPayrollStur],
	(structure) => structure?.categories
);

export const selectAllRemuneration = createSelector(
	[selectPayrollStur],
	(structure) => structure?.remunerations
);

export const selectSingleRemuneration = createSelector(
	[selectPayrollStur],
	(structure) => structure?.remuneration
);

export const selectAllPayPeriod = createSelector(
	[selectPayrollStur],
	(structure) => structure?.payPeriods
);

export const selectEmployeeTransactions = createSelector(
	[selectPayrollStur],
	(structure) => structure?.transactions
);

export const selectEmployeeDrivenTaxRelief = createSelector(
	[selectPayrollStur],
	(structure) => structure?.employeeDrivenTaxRelief
);

export const selectEmployeeDrivenPayroll = createSelector(
	[selectPayrollStur],
	(structure) => structure?.employeeDrivenPayroll
);

export const selectPayrollReadyForTransaction = createSelector(
	[selectPayrollStur],
	(structure) => structure?.payrollReadyForTransaction
);

export const selectPayrollLoans = createSelector(
	[selectPayrollStur],
	(structure) => structure?.loans
);
