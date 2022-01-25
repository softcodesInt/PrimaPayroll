/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import { createSelector } from 'reselect';

const selectAccounts = (state) => state.accounts;

export const selectAccountsLoading = createSelector(
	[selectAccounts],
	(accounts) => accounts.isLoading
);

export const selectCurrentStaffs = createSelector(
	[selectAccounts],
	(accounts) => accounts.staffs?.results
);
export const selectAllCurrentStaffs = createSelector(
	[selectAccounts],
	(accounts) => accounts.staffs
);

export const selectCurrentCompanies = createSelector(
	[selectAccounts],
	(accounts) => accounts.companies
);
export const selectCompanyAudit = createSelector(
	[selectAccounts],
	(accounts) => accounts.company_audit
);
export const selectStaffAudit = createSelector(
	[selectAccounts],
	(accounts) => accounts.staff_audit
);
export const selectCurrentCompany = createSelector(
	[selectAccounts],
	(accounts) => accounts.currentCompany
);

export const selectAuditLogs = createSelector(
	[selectAccounts],
	(accounts) => accounts.audit_log
);
export const selectAuditLoading = createSelector(
	[selectAccounts],
	(accounts) => accounts.isAuditLoading
);
export const selectStaffLoading = createSelector(
	[selectAccounts],
	(accounts) => accounts.isStaffLoading
);
export const selectCompanyLoading = createSelector(
	[selectAccounts],
	(accounts) => accounts.isCompanyLoading
);
