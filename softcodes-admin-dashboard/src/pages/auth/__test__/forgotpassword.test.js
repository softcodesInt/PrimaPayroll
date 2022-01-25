/* -------------------------- External Dependencies ------------------------- */
import React from 'react';
import ReactDOM from 'react-dom';
import { cleanup } from '@testing-library/react';
import renderer from 'react-test-renderer';

import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { Formik } from 'formik';
import { HelmetProvider } from 'react-helmet-async';

/* -------------------------- Internal Dependencies ------------------------- */
import history from 'redux/history';
import Forgot from '../forgotpassword';

const mockStore = configureStore([]);
describe('Forgot Component', () => {
	afterEach(cleanup);
	let store;
	let component;
	beforeEach(() => {
		store = mockStore({
			user: {
				isLoading: false,
			},
		});
		store.dispatch = jest.fn();
		component = renderer.create(
			<HelmetProvider>
				<Provider store={store}>
					<Router history={history}>
						<Forgot />
					</Router>
				</Provider>
			</HelmetProvider>
		);
	});
	it('Forgot Renders Without Crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(
			<HelmetProvider>
				<Provider store={store}>
					<Router history={history}>
						<Forgot />
					</Router>
				</Provider>
			</HelmetProvider>,
			div
		);
		ReactDOM.unmountComponentAtNode(div);
	});

	it('Forgot matches data snapshot', () => {
		expect(component.toJSON()).toMatchSnapshot();
	});

	it('Forgot should dispatch an action on button click', () => {
		renderer.act(() => {
			component.root.findByType(Formik).props.onSubmit({
				email: 'adenekanwonderful41@gmail.com',
			});
		});

		expect(store.dispatch).toHaveBeenCalledTimes(1);
	});
});
