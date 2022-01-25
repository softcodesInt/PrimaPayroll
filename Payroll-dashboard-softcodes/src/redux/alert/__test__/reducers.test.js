/* -------------------------- Internal Dependencies ------------------------- */
import alertReducer from '../reducer';
import { SET_ALERT, REMOVE_ALERT } from '../types';

describe('Alert Reducer', () => {
	test('is correct', () => {
		const action = { type: 'dummy_action' };
		const initialState = [];

		expect(alertReducer(undefined, action)).toEqual(initialState);
	});
	test('returns the correct state when alert is success', () => {
		const action = {
			type: SET_ALERT,
			payload: {
				alertType: 'success',
				id: '34sdvsdf2e23',
				msg: 'Successfully rendered actiom',
			},
		};
		const expectedState = [
			{
				alertType: 'success',
				id: '34sdvsdf2e23',
				msg: 'Successfully rendered actiom',
			},
		];

		expect(alertReducer(undefined, action)).toEqual(expectedState);
		expect(alertReducer(undefined, action)).toMatchSnapshot();
	});
	test('returns the correct state when alert is Error', () => {
		const action = {
			type: SET_ALERT,
			payload: {
				alertType: 'error',
				id: '34sdvsdf2e23',
				msg: 'An Error Occured.',
			},
		};
		const expectedState = [
			{
				alertType: 'error',
				id: '34sdvsdf2e23',
				msg: 'An Error Occured.',
			},
		];

		expect(alertReducer(undefined, action)).toEqual(expectedState);
		expect(alertReducer(undefined, action)).toMatchSnapshot();
	});
	test('removes alert', () => {
		const action = {
			type: REMOVE_ALERT,
			payload: '34sdvsdf2e23',
		};
		const expectedState = [];

		expect(alertReducer(undefined, action)).toEqual(expectedState);
		expect(alertReducer(undefined, action)).toMatchSnapshot();
	});
});
