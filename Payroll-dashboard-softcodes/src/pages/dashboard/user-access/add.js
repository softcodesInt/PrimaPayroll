/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-shadow */
import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { isEqual } from 'lodash';
import { isEmpty } from 'codewonders-helpers';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import Button from 'components/button';
import Input from 'components/input';
import Modal, { ModalWrap } from 'components/modal';
import Radio from 'components/radio';
import { createStaffValdationSchema } from 'utils/validation-schema';
import { createAdminUser, editAdminUser } from 'redux/user/actions';
import { selectisLoading } from 'redux/settings/selectors';

const propTypes = {
	show: PropTypes.bool,
	closeModal: PropTypes.func,
	isLoading: PropTypes.bool,
	isEdit: PropTypes.bool,
	data: PropTypes.shape,
	createAdminUser: PropTypes.func,
	editAdminUser: PropTypes.func,
};

const AddUserAccess = ({
	show,
	closeModal,
	isLoading,
	isEdit,
	data,
	createAdminUser,
	editAdminUser,
}) => {
	const state = isEmpty(data)
		? {
				first_name: '',
				last_name: '',
				email: '',
				has_all_access: '',
				password: '',
		  }
		: {
				...data,
		  };

	return (
		<>
			<Modal
				show={show}
				closeModal={closeModal}
				title={isEdit ? 'Edit User Access' : 'Add New User Access'}
			>
				<ModalWrap className="row">
					<div className="col-md-6">
						<Formik
							initialValues={state}
							validationSchema={createStaffValdationSchema}
							onSubmit={async (
								{ first_name, last_name, email, has_all_access },
								resetForm
							) => {
								if (!isEdit) {
									try {
										await createAdminUser?.({
											first_name,
											last_name,
											email,
											has_all_access,
										});
										closeModal();
										resetForm({});
									} catch (e) {}
								} else {
									try {
										await editAdminUser?.(data?.id, {
											first_name,
											last_name,
											email,
											has_all_access,
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
										id="first_name"
										name="first_name"
										type="text"
										label="First Name*"
										placeholder="Enter First Name"
										value={values.first_name}
										onChange={handleChange}
										onBlur={handleBlur}
										errorMessage={errors.first_name}
										isInvalid={errors.first_name && touched.first_name}
									/>
									<Input
										hasStrip
										id="last_name"
										name="last_name"
										type="text"
										label="Last Name*"
										placeholder="Enter Last Name"
										value={values.last_name}
										onChange={handleChange}
										onBlur={handleBlur}
										errorMessage={errors.last_name}
										isInvalid={errors.last_name && touched.last_name}
									/>
									<Input
										hasStrip
										id="email"
										name="email"
										type="text"
										label="Email Address*"
										placeholder="Enter Email Address"
										value={values.email}
										onChange={handleChange}
										onBlur={handleBlur}
										errorMessage={errors.email}
										isInvalid={errors.email && touched.email}
									/>
									<label className="mb-3">Should have all access*</label>
									<div className="d-flex flex-wrap">
										<Radio
											name="has_all_access"
											type="radio"
											checked={values.has_all_access === true}
											value="active"
											onChange={() => setFieldValue('has_all_access', true)}
										>
											{' '}
											<p className="radio">Yes</p>
										</Radio>
										<Radio
											name="has_all_access"
											type="radio"
											checked={values.has_all_access === false}
											value="inactive"
											onChange={() => setFieldValue('has_all_access', false)}
										>
											{' '}
											<p className="radio">No</p>
										</Radio>
									</div>
									<Button
										type="submit"
										className="btn-soft mr-auto mt-4"
										isLoading={isLoading}
										disabled={isLoading || isEqual(values, state)}
									>
										{isEdit ? 'Save Changes' : 'Add Admin User'}
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

AddUserAccess.propTypes = propTypes;

const mapStateToProps = createStructuredSelector({
	isLoading: selectisLoading,
});
export default connect(mapStateToProps, { createAdminUser, editAdminUser })(
	AddUserAccess
);
