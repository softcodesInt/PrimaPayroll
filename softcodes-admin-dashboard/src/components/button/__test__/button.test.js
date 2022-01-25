/* -------------------------- External Dependencies ------------------------- */
import React from 'react';
import ReactDOM from 'react-dom';
import { render, cleanup } from '@testing-library/react';
import renderer from 'react-test-renderer';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

/* --------------------------- Internal Dependency -------------------------- */
import Button from '..';

describe('Button Component', () => {
	afterEach(cleanup);

	it('Button Renders Without Crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(<Button />, div);
		ReactDOM.unmountComponentAtNode(div);
	});

	it('Button Renders Correctly With Attributes', () => {
		const { getByTestId } = render(
			<Button
				disabled
				width="20px"
				className="btn-delay"
				type="submit"
				size="large"
			>
				Click Me
			</Button>
		);
		expect(getByTestId('button')).toHaveClass('button btn-delay');
		expect(getByTestId('button')).toHaveAttribute('disabled');
		expect(getByTestId('button')).toHaveAttribute('width');
		expect(getByTestId('button')).toHaveAttribute('type');
	});

	it('Button matches snapshot', () => {
		const tree = renderer
			.create(
				<Button disabled width="20px" className="btn-delay" type="submit">
					Button
				</Button>
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
