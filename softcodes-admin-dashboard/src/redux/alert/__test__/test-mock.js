/* -------------------------- Internal Dependencies ------------------------- */
import { REMOVE_ALERT, SET_ALERT } from '../types';

export const expectedActions = [];

export const REMOVE_ALERT_MOCK = () =>
	expectedActions.push({
		payload: 1,
		type: REMOVE_ALERT,
	});

export const SET_ALERT_MOCK = (array) =>
	array.push({
		payload: {
			alertType: 'error',
			id: 1,
			msg: 'An Error Occured',
		},
		type: SET_ALERT,
	});
