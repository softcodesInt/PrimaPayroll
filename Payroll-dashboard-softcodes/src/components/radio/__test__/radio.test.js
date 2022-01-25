/* -------------------------- External Dependencies ------------------------- */
import React from 'react';
import ReactDOM from 'react-dom';
import { cleanup } from '@testing-library/react';
import renderer from 'react-test-renderer';

import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

/* --------------------------- Internal Dependency -------------------------- */
import Radio from '..';
const RadioMock = ({ checked = true, active = null }) => {
	return (
		<Radio
			activeColor={active}
			checked={checked}
			name="radio"
			value="radio"
			onChange={() => jest.fn()}
		>
			{' '}
			First Radio
		</Radio>
	);
};
describe('Radio Component', () => {
	afterEach(cleanup);

	it('Radio Renders Without Crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(<RadioMock />, div);
		ReactDOM.unmountComponentAtNode(div);
	});

	it('Radio matches snapshot checked', () => {
		const tree = renderer.create(<RadioMock />).toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('Radio matches snapshot when not checked', () => {
		const tree = renderer
			.create(<RadioMock checked={false} active="green" />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
