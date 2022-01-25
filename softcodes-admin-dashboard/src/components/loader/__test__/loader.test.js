/* -------------------------- External Dependencies ------------------------- */
import React from 'react';
import ReactDOM from 'react-dom';
import { render, cleanup } from '@testing-library/react';
import renderer from 'react-test-renderer';

import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

/* -------------------------- Internal Dependencies ------------------------- */
import Loader from '..';

describe('Loader Component', () => {
	afterEach(cleanup);

	it('Loader Renders Without Crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(<Loader />, div);
		ReactDOM.unmountComponentAtNode(div);
	});

	it('Loader Renders Correctly With Attributes', () => {
		const { getByTestId } = render(<Loader loadingText="Loading" />);
		expect(getByTestId('loading-text')).toHaveTextContent('Loading');
	});

	it('Loader matches snapshot', () => {
		const tree = renderer.create(<Loader loadingText="Loading" />).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
