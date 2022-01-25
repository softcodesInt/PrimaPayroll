/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React from 'react';
import ReactDOM from 'react-dom';
import { cleanup } from '@testing-library/react';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

/* -------------------------- Internal Dependencies ------------------------- */
import { removeAlert } from '../../../redux/alert/actions';
import Alerts from '..';

const mockStore = configureStore([]);

describe('Alerts Component', () => {
	afterEach(cleanup);
	let store;
	let component;
	beforeEach(() => {
		store = mockStore({
			alerts: [{ alertType: 'error', msg: 'Error', id: 'Gwz233gQ122' }],
		});
		store.dispatch = jest.fn();
		component = renderer.create(
			<Provider store={store}>
				<Alerts />
			</Provider>
		);
	});
	it('Alerts Renders Without Crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(
			<Provider store={store}>
				<Alerts />
			</Provider>,
			div
		);
		ReactDOM.unmountComponentAtNode(div);
	});

	it('Alerts matches data snapshot', () => {
		expect(component.toJSON()).toMatchSnapshot();
	});

	it('Alerts should dispatch an action on button click', () => {
		renderer.act(() => {
			component.root.findByType('button').props.onClick();
		});
		expect(store.dispatch).toHaveBeenCalledTimes(1);
		expect(store.dispatch).toHaveBeenCalledWith(removeAlert('Gwz233gQ122'));
	});
});
