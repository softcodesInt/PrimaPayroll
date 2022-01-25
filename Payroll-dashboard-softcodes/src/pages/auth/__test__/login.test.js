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
import Login from '../login';

const mockStore = configureStore([]);
describe('Login Component', () => {
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
						<Login />
					</Router>
				</Provider>
			</HelmetProvider>
		);
	});
	it('Login Renders Without Crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(
			<HelmetProvider>
				<Provider store={store}>
					<Router history={history}>
						<Login />
					</Router>
				</Provider>
			</HelmetProvider>,
			div
		);
		ReactDOM.unmountComponentAtNode(div);
	});

	it('Login matches data snapshot', () => {
		expect(component.toJSON()).toMatchSnapshot();
	});

	it('Login should dispatch an action on button click', () => {
		renderer.act(() => {
			component.root.findByType(Formik).props.onSubmit({
				email: 'adenekanwonderful41@gmail.com',
				password: '123456',
			});
		});

		expect(store.dispatch).toHaveBeenCalledTimes(1);
	});
});
