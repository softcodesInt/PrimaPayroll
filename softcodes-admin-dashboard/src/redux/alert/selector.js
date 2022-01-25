/* -------------------------- External Dependencies ------------------------- */
import { createSelector } from 'reselect';

/**
 * Select Alert
 * @param {Object} state
 */
const selectAlert = (state) => state.alerts;

export const selectAlertItems = createSelector([selectAlert], (alert) => alert);
