/* -------------------------- External Dependencies ------------------------- */
import React from 'react';
import ReactDOM from 'react-dom';
import { render, cleanup } from '@testing-library/react';
import AuthLayout from '..';
import renderer from 'react-test-renderer';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import renderWithRouter from 'utils/render-with-router';
import { Router } from 'react-router-dom';

/* -------------------------- Internal Dependencies ------------------------- */
import history from '../../../../redux/history';
import isAuthenticated from '../../../../utils/is-authenticated';

afterEach(cleanup);

describe('AuthLayout Component', () => {
	it('AuthLayout Renders Without Crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(
			<Router history={history}>
				<AuthLayout />
			</Router>,
			div
		);
		ReactDOM.unmountComponentAtNode(div);
	});

	it('AuthLayout Renders Correctly With Attributes', () => {
		const { getByTestId } = render(
			<AuthLayout>
				<h1>Auth Layout</h1>
			</AuthLayout>
		);
		expect(getByTestId('auth-layout')).toHaveTextContent('Auth Layout');
	});

	it('AuthLayout matches snapshot', () => {
		const tree = renderer.create(<AuthLayout>AuthLayout</AuthLayout>).toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('redirects when authToken invalid', async () => {
		const { history: historys } = renderWithRouter(<AuthLayout />);
		if (!isAuthenticated()) {
			expect(historys.location.pathname).toEqual('/');
		}
	});
});
