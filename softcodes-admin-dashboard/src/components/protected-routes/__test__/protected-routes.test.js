/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React from 'react';
import ReactDOM from 'react-dom';
import { cleanup } from '@testing-library/react';
import renderer from 'react-test-renderer';

import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

/* --------------------------- Internal Dependency -------------------------- */
import history from 'redux/history';
import ProtectedRoute from '..';
import EmptyState from 'components/empty-state';

const mockStore = configureStore([thunk]);
describe('Protected  Routes', () => {
	afterEach(cleanup);
	let store;
	beforeAll(() => {
		store = mockStore({
			tests: {
				current_test: {},
			},
		});
		store.dispatch = jest.fn();
	});
	it('Protected  Renders Without Crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(
			<Provider store={store}>
				<Router history={history}>
					<ProtectedRoute component={EmptyState} />
				</Router>
			</Provider>,
			div
		);
		ReactDOM.unmountComponentAtNode(div);
	});

	it('Protected  matches snapshot', () => {
		const tree = renderer
			.create(
				<Provider store={store}>
					<Router history={history}>
						<ProtectedRoute component={EmptyState} />
					</Router>
				</Provider>
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
