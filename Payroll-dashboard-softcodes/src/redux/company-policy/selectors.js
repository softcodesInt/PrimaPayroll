/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import { createSelector } from 'reselect';

const selectCompanyPolicyStur = (state) => state.company_policy_structure;

export const selectisLoading = createSelector(
	[selectCompanyPolicyStur],
	(structure) => structure.isLoading
);
export const selectisLoadingCompanyPolicy = createSelector(
	[selectCompanyPolicyStur],
	(structure) => structure.isLoadingCompanyPolicy
);
export const selectisLoadingHoliday = createSelector(
	[selectCompanyPolicyStur],
	(structure) => structure.isLoadingHolidays
);
export const selectisLoadingTaxTable = createSelector(
	[selectCompanyPolicyStur],
	(structure) => structure.isLoadingTaxTable
);
export const selectAllCompanyPolicy = createSelector(
	[selectCompanyPolicyStur],
	(structure) => structure.company_policies
);
export const selectAllHolidays = createSelector(
	[selectCompanyPolicyStur],
	(structure) => structure.holidays
);
export const selectAllTaxTable = createSelector(
	[selectCompanyPolicyStur],
	(structure) => structure.tax_table
);
export const selectAllPayPeriod = createSelector(
	[selectCompanyPolicyStur],
	(structure) => structure.pay_period
);
