/* -------------------------- External Dependecies -------------------------- */

import React from 'react';
import ReactDOM from 'react-dom';
import { render, cleanup } from '@testing-library/react';
import renderer from 'react-test-renderer';

import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

/* --------------------------- Internal Dependency -------------------------- */
import Input from '..';

const InputMock = ({ isInvalid = false, type = 'text' }) => {
	return (
		<Input
			id="input"
			type={type}
			placeholder="Enter Text Here"
			hasStrip
			label="text"
			isInvalid={isInvalid}
			errorMessage="Fill Input Out"
			value="12345"
			onChange={(e) => e.target.value}
		/>
	);
};
describe('Input Component', () => {
	afterEach(cleanup);

	it('Input Renders Without Crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(<InputMock />, div);
		ReactDOM.unmountComponentAtNode(div);
	});

	it('Input Renders Input Correctly With Attributes', () => {
		const { getByTestId } = render(<InputMock />);
		// console.log();
		expect(getByTestId('input')).not.toHaveAttribute('disabled');
	});

	it('Input matches snapshot', () => {
		const tree = renderer.create(<InputMock />).toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('Input matches snapshot when type is password', () => {
		const tree = renderer
			.create(<InputMock isInvalid={true} type="password" />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('Test click event', () => {
		const component = renderer.create(
			<Input
				id="input"
				type="password"
				placeholder="Enter Text Here"
				hasStrip
				label="text"
				isInvalid
				errorMessage="Fill Input Out"
				value=""
			/>
		);
		renderer.act(() => {
			component.root.findByType('button').props.onClick();
		});
	});
});
