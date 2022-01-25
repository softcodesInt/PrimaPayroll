/* -------------------------- External Dependencies ------------------------- */
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { render, cleanup } from '@testing-library/react';
import renderer from 'react-test-renderer';

import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

/* -------------------------- Internal Dependencies ------------------------- */
import Modal from '..';

const ModalMock = () => {
	const [showModal, setShowModal] = useState(false);
	const toggleShowModal = () => setShowModal((prevShowModal) => !prevShowModal);

	return (
		<Modal show={showModal} closeModal={toggleShowModal} title="Modal Heading">
			<p>Here is a modal</p>
		</Modal>
	);
};
describe('Modal Component', () => {
	beforeAll(() => {
		ReactDOM.createPortal = jest.fn((element, node) => {
			return element;
		});
	});

	afterEach(() => {
		cleanup();
		ReactDOM.createPortal.mockClear();
	});

	it('Modal Renders Without Crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(<ModalMock />, div);
		ReactDOM.unmountComponentAtNode(div);
	});

	it('Modal Renders Correctly With Attributes', () => {
		const { getByTestId } = render(
			<Modal show title="Modal Heading">
				<p>Here is a modal</p>
			</Modal>
		);
		expect(getByTestId('modal-title')).toHaveTextContent('Modal Heading');
	});

	it('Modal matches snapshot', () => {
		const tree = renderer.create(<ModalMock />).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
