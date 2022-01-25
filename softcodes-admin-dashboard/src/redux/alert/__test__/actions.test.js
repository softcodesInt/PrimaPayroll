/* -------------------------- External Dependencies ------------------------- */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

/* -------------------------- Internal Dependencies ------------------------- */
import * as alertsReducer from '../reducer';
import { setAlert, removeAlert } from '../actions';
import {
	expectedActions,
	SET_ALERT_MOCK,
	REMOVE_ALERT_MOCK,
} from './test-mock';

const createStore = configureMockStore([thunk]);
const store = createStore(alertsReducer.initalState);
jest.mock('uuid', () => {
	return {
		v4: jest.fn(() => 1),
	};
});

describe('Alerts Action', () => {
	beforeEach(() => {});
	test('Dispatches the correct action and payload for setting alerts', () => {
		SET_ALERT_MOCK(expectedActions);
		store.dispatch(setAlert('An Error Occured', 'error'));
		setTimeout(() => REMOVE_ALERT_MOCK(), 8000);
		expect(store.getActions()).toEqual(expectedActions);
		expect(store.getActions()).toMatchSnapshot();
	});
	test('Dispatches the correct action and payload for removing alerts', () => {
		REMOVE_ALERT_MOCK();

		store.dispatch(removeAlert(1));
		expect(store.getActions()).toEqual(expectedActions);
		expect(store.getActions()).toMatchSnapshot();
	});
});
