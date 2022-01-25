/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { isEqual } from 'lodash';
import { isEmpty } from 'codewonders-helpers';
// import { useParams } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

/* -------------------------- Internal Dependencies ------------------------- */
import Button from 'components/button';
import Input from 'components/input';
import TextArea from 'components/textarea';
import Modal, { ModalWrap } from 'components/modal';
import Radio from 'components/radio';
import { headValidation } from 'utils/validation-schema';
import {
	addNatureOfContract,
	editNatureOfContract,
} from 'redux/settings/actions';
import { selectisLoading } from 'redux/settings/selectors';

/* ---------------------------- AddSubsidiaries PropTypes --------------------------- */
const propTypes = {
	show: PropTypes.bool,
	closeModal: PropTypes.func,
	isLoading: PropTypes.bool,
	isEdit: PropTypes.bool,
	addSubsidiary: PropTypes.func,
	editSubsidiary: PropTypes.func,
};

const AddNatureOfContract = ({
	show,
	closeModal,
	isLoading,
	isEdit,
	data,
	editNatureOfContract,
	addNatureOfContract,
}) => {
	const state = isEmpty(data)
		? { name: '', description: '', is_active: 'active' }
		: {
				...data,
				is_active: data?.is_active ? 'active' : 'inactive',
		  };

	return (
		<>
			<Modal
				show={show}
				closeModal={closeModal}
				title={
					isEdit ? 'Edit Nature of Contract' : 'Add New Nature of Contract'
				}
			>
				<ModalWrap className="row">
					<div className="col-md-6">
						<Formik
							initialValues={state}
							validationSchema={headValidation}
							onSubmit={async ({ name, description, is_active }, resetForm) => {
								if (!isEdit) {
									try {
										await addNatureOfContract?.({
											name,
											description,
											is_active: is_active === 'active' || false,
										});
										closeModal();
										resetForm({});
									} catch (e) {}
								} else {
									try {
										await editNatureOfContract?.(data?.id, {
											name,
											description,
											is_active: is_active === 'active' || false,
										});
										closeModal();
									} catch (e) {}
								}
							}}
						>
							{({
								values,
								errors,
								touched,
								handleChange,
								setFieldValue,
								handleBlur,
								handleSubmit,
							}) => (
								<form onSubmit={handleSubmit}>
									<Input
										hasStrip
										id="name"
										name="name"
										type="text"
										label="Name*"
										placeholder="Enter Nature of contract"
										value={values.name}
										onChange={handleChange}
										onBlur={handleBlur}
										errorMessage={errors.name}
										isInvalid={errors.name && touched.name}
									/>
									<TextArea
										hasStrip
										id="description"
										name="description"
										label="Description"
										placeholder="Enter description"
										value={values.description}
										onChange={handleChange}
										onBlur={handleBlur}
										errorMessage={errors.description}
										isInvalid={errors.description && touched.description}
									/>
									<label className="mb-3">Status*</label>
									<div className="d-flex flex-wrap">
										<Radio
											name="is_active"
											type="radio"
											checked={values.is_active === 'active'}
											value="active"
											onChange={() => setFieldValue('is_active', 'active')}
										>
											{' '}
											<p className="radio">Active</p>
										</Radio>
										<Radio
											name="is_active"
											type="radio"
											checked={values.is_active === 'inactive'}
											value="inactive"
											onChange={() => setFieldValue('is_active', 'inactive')}
										>
											{' '}
											<p className="radio">Inactive</p>
										</Radio>
									</div>
									<Button
										type="submit"
										className="btn-soft mr-auto mt-4"
										isLoading={isLoading}
										disabled={isLoading || isEqual(values, state)}
									>
										{isEdit ? 'Save Changes' : 'Add Nature Of Contract'}
									</Button>
								</form>
							)}
						</Formik>
					</div>
				</ModalWrap>
			</Modal>
		</>
	);
};

AddNatureOfContract.propTypes = propTypes;

const mapStateToProps = createStructuredSelector({
	isLoading: selectisLoading,
});
export default connect(mapStateToProps, {
	addNatureOfContract,
	editNatureOfContract,
})(AddNatureOfContract);
