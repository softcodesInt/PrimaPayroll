import { createSelector } from 'reselect';

const selectUser = (state) => state.user;

export const selectisLoading = createSelector(
	[selectUser],
	(user) => user.isLoading
);

export const selectCurrentCompany = createSelector(
	[selectUser],
	(user) => user?.fetchedCompany
);

export const selectAuthUser = createSelector(
	[selectUser],
	(user) => user.currentUser
);

export const selectUserError = createSelector(
	[selectUser],
	(user) => user.error
);

export const selectUserMessage = createSelector(
	[selectUser],
	(user) => user.errorMessage
);

export const selectAdminUsers = createSelector(
	[selectUser],
	(user) => user.users
);
