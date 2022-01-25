/* eslint-disable no-shadow */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import { isEqual } from 'lodash';

import Button from 'components/button';
import Input from 'components/input';
import Modal, { ModalWrap } from 'components/modal';
import Radio from 'components/radio';
import TextArea from 'components/textarea';
import { payrollCategoryValidation } from 'utils/validation-schema';
import { createStructuredSelector } from 'reselect';
import { addCategory, editCategory } from 'redux/payroll/actions';
import { selectisLoadingCategory } from 'redux/payroll/selectors';
import { selectAllCompanyPolicy } from 'redux/company-policy/selectors';
import isEmpty from 'codewonders-helpers/bundle-cjs/helpers/is-empty';
import { useParams } from 'react-router-dom';
import Select from 'components/select';

const propTypes = {
	show: PropTypes.bool,
	closeModal: PropTypes.func,
	addCategory: PropTypes.func,
	editCategory: PropTypes.func,
	data: PropTypes.object,
	isLoading: PropTypes.bool,
	isEdit: PropTypes.bool,
	policies: PropTypes.shape,
};

const AddPayrollCategories = ({
	show,
	closeModal,
	isLoading,
	addCategory,
	editCategory,
	isEdit,
	data,
	policies,
}) => {
	const { id } = useParams();
	const state = isEmpty(data)
		? { name: '', description: '', is_active: 'active', company_policy: '' }
		: {
				...data,
				is_active: data?.is_active ? 'active' : 'inactive',
				company_policy: data?.company_policy?.id,
		  };

	return (
		<>
			<Modal
				show={show}
				closeModal={closeModal}
				title={isEdit ? 'Edit Payroll Group' : 'Add New Payroll Group'}
			>
				<ModalWrap>
					<div className="col-md-6">
						<Formik
							initialValues={state}
							enableReinitialize
							validationSchema={payrollCategoryValidation}
							onSubmit={async (
								{ name, description, is_active, company_policy },
								resetForm
							) => {
								if (!isEdit) {
									try {
										await addCategory?.({
											name,
											description,
											is_active: is_active === 'active' || false,
											company_policy,
										});
										closeModal();
										resetForm({});
									} catch (e) {}
								} else {
									try {
										await editCategory?.(
											data?.id,
											{
												name,
												description,
												is_active: is_active === 'active' || false,
												company_policy,
											},
											id
										);
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
										placeholder="Enter name of the group"
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
									<Select
										hasStrip
										id="company_policy"
										name="company_policy"
										label="Company Policy"
										value={values.company_policy}
										onChange={handleChange}
										onBlur={handleBlur}
										errorMessage={errors.company_policy}
										isInvalid={errors.company_policy && touched.company_policy}
									>
										<option value="">-Select-</option>
										{policies?.results.map((company_policy) => (
											<option value={company_policy.id}>
												{company_policy.name}
											</option>
										))}
									</Select>
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
										{isEdit ? 'Save Changes' : 'Add Payroll Group'}
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

AddPayrollCategories.propTypes = propTypes;
const mapStateToProps = createStructuredSelector({
	isLoading: selectisLoadingCategory,
	policies: selectAllCompanyPolicy,
});
export default connect(mapStateToProps, { addCategory, editCategory })(
	AddPayrollCategories
);
