/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import { createSelector } from 'reselect';

const selectUser = (state) => state.user;

export const selectisLoading = createSelector(
	[selectUser],
	(user) => user.isLoading
);

export const selectCurrentUser = createSelector(
	[selectUser],
	(user) => user?.fetchedUser
);
export const selectCurrentActivity = createSelector([selectUser], (user) => {
	return {
		user: user.fetchedUser?.user,
		activity: user.fetchedUser?.activity,
		managing: user?.fetchedUser?.company_managing,
	};
});

export const selectAuthUser = createSelector(
	[selectUser],
	(user) => user.currentUser
);

export const selectCurrentCompanyActivity = createSelector(
	[selectUser],
	(user) => user.fetchedUser?.company_activity
);
export const selectDashboardActiviy = createSelector(
	[selectUser],
	(user) => user?.dashboardActiviy
);

export const selectCurrentStaffActivity = createSelector(
	[selectUser],
	(user) => user.fetchedUser?.staff_activity
);

export const selectUserError = createSelector(
	[selectUser],
	(user) => user.error
);

export const selectUserMessage = createSelector(
	[selectUser],
	(user) => user.errorMessage
);
