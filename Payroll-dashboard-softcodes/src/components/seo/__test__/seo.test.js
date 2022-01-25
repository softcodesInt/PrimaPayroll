/* -------------------------- External Dependencies ------------------------- */
import React from 'react';
import ReactDOM from 'react-dom';
import { render, cleanup } from '@testing-library/react';
import renderer from 'react-test-renderer';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

/* --------------------------- Internal Dependency -------------------------- */
import SEO from '..';
import { HelmetProvider } from 'react-helmet-async';

describe('SEO Component', () => {
	afterEach(cleanup);

	it('SEO Renders Without Crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(
			<HelmetProvider>
				<SEO />
			</HelmetProvider>,
			div
		);
		ReactDOM.unmountComponentAtNode(div);
	});

	it('SEO matches snapshot', () => {
		const tree = renderer
			.create(
				<HelmetProvider>
					<SEO title="Empty">Empty</SEO>
				</HelmetProvider>
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('SEO matches snapshot with no text', () => {
		const tree = renderer
			.create(
				<HelmetProvider>
					<SEO title="Script">Empty</SEO>
				</HelmetProvider>
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
