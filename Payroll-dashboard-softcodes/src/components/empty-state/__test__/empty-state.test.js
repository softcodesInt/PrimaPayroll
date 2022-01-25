/* -------------------------- External Dependencies ------------------------- */
import React from 'react';
import ReactDOM from 'react-dom';
import { render, cleanup } from '@testing-library/react';
import renderer from 'react-test-renderer';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

/* --------------------------- Internal Dependency -------------------------- */
import EmptyState from '..';

describe('EmptyState Component', () => {
	afterEach(cleanup);

	it('EmptyState Renders Without Crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(<EmptyState />, div);
		ReactDOM.unmountComponentAtNode(div);
	});

	it('EmptyState Renders EmptyState Correctly With Attributes', () => {
		const { getByTestId } = render(<EmptyState text="Empty">Empty</EmptyState>);
		expect(getByTestId('empty-state')).toHaveTextContent('Empty');
	});

	it('EmptyState matches snapshot', () => {
		const tree = renderer
			.create(<EmptyState text="Empty">Empty</EmptyState>)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('EmptyState matches snapshot with no text', () => {
		const tree = renderer.create(<EmptyState>Empty</EmptyState>).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
