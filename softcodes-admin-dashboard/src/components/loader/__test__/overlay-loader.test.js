/* -------------------------- External Dependencies ------------------------- */
import React from 'react';
import ReactDOM from 'react-dom';
import { render, cleanup } from '@testing-library/react';
import renderer from 'react-test-renderer';

import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

/* -------------------------- Internal Dependencies ------------------------- */
import OverlayLoader from '../overlay';

describe('Overlay Loader Component', () => {
	afterEach(cleanup);

	it('Overlay Loader Renders Without Crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(<OverlayLoader loading />, div);
		ReactDOM.unmountComponentAtNode(div);
	});

	it('Overlay Loader Renders Correctly With Attributes', () => {
		const { getByTestId } = render(
			<OverlayLoader loadingText="Loading" loading />
		);
		expect(getByTestId('overlay-text')).toHaveTextContent('Loading');
	});

	it('Overlay Loader matches snapshot', () => {
		const tree = renderer
			.create(<OverlayLoader loadingText="Loading" loading />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
