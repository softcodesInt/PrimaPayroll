/* -------------------------- External Dependencies ------------------------- */
import { guidGenerator } from 'codewonders-helpers';

/* -------------------------- Internal Dependencies ------------------------- */
import { SET_ALERT, REMOVE_ALERT } from './types';

/**
 * Set Alert
 * @param {String} msg
 * @param {String} alertType
 * @param {number} duration
 */
export const setAlert = (msg, alertType, duration = 20000) => {
	return (dispatch) => {
		const id = guidGenerator();

		dispatch({
			type: SET_ALERT,
			payload: { msg: msg ?? 'An Error Occured', alertType, id },
		});
		setTimeout(() => {
			dispatch({
				type: REMOVE_ALERT,
				payload: id,
			});
		}, duration);
	};
};

/**
 * Remove Alert
 * @param {String} id
 */
export const removeAlert = (id) => ({
	type: REMOVE_ALERT,
	payload: id,
});
