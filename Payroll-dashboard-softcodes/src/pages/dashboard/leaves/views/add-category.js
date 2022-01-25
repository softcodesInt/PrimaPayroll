/* eslint-disable no-shadow */
/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import { isEqual } from 'lodash';

/* -------------------------- Internal Dependencies ------------------------- */
import Button from 'components/button';
import Input from 'components/input';
import Modal, { ModalWrap } from 'components/modal';
import Radio from 'components/radio';
import TextArea from 'components/textarea';
import { createLeaveCategoryValidation } from 'utils/validation-schema';
import { createStructuredSelector } from 'reselect';
import isEmpty from 'codewonders-helpers/bundle-cjs/helpers/is-empty';
import { selectAllCompanyPolicy } from 'redux/company-policy/selectors';
import { getAllCompanyPolicy } from 'redux/company-policy/actions';
import { useParams } from 'react-router-dom';
import {
	editCategory,
	addCategory,
	getLeaveById,
	getAllLeaveCategory,
} from 'redux/leave/actions';
import { selectisLoadingCategory } from 'redux/leave/selectors';
import { useMount } from 'broad-state';
import { MultiSelect } from 'components/select';

/* ---------------------------- AddCategory PropTypes --------------------------- */
const propTypes = {
	show: PropTypes.bool,
	closeModal: PropTypes.func,
	addCategory: PropTypes.func,
	data: PropTypes.object,
	isLoading: PropTypes.bool,
	isEdit: PropTypes.bool,
	getLeaveById: PropTypes.func,
	getAllLeaveCategory: PropTypes.func,
	getAllCompanyPolicy: PropTypes.func,
	policies: PropTypes.array,
	editCategory: PropTypes.func,
};

const AddCategory = ({
	show,
	closeModal,
	isLoading,
	addCategory,
	editCategory,
	isEdit,
	data,
	getLeaveById,
	getAllLeaveCategory,
	getAllCompanyPolicy,
	policies,
}) => {
	const { id } = useParams();

	useMount(() => {
		if (isEmpty(policies?.results)) {
			getAllCompanyPolicy('', 1, '', true);
		}
	});

	const getSubsidiaryOptions = () => {
		if (!isEmpty(policies?.results)) {
			return policies.results.map((data) => {
				return {
					value: data.id,
					label: data.name,
				};
			});
		}
		return [];
	};

	const getDefaultComapnies = (value) => {
		let d;
		let formattedData;
		if (!isEmpty(value)) {
			d = value?.filter((option) => {
				return getSubsidiaryOptions()?.filter(
					(data) => data.id === option.value
				);
			});
		}
		if (d) {
			formattedData = d.map((data) => {
				return {
					label: data.name,
					value: data.id,
				};
			});
		}
		return formattedData;
	};

	const state = isEmpty(data)
		? { name: '', description: '', is_active: 'active', company_policy: '' }
		: {
				...data,
				is_active: data?.is_active ? 'active' : 'inactive',
		  };

	return (
		<>
			<Modal
				show={show}
				closeModal={closeModal}
				title={isEdit ? 'Edit Leave  Category' : 'Add New Leave Category'}
				description="Create a leave category that can be assigned to employees"
			>
				<ModalWrap>
					<div className="col-md-6">
						<Formik
							initialValues={state}
							enableReinitialize
							validationSchema={createLeaveCategoryValidation}
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
											company_policy: company_policy.map((item) => item.value),
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
												company_policy: company_policy.map(
													(item) => item.value || item.id
												),
											},
											id
										);
										if (id) {
											getLeaveById(id);
										} else {
											getAllLeaveCategory();
										}
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
								setFieldTouched,
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
										placeholder="Enter name of the leave category"
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
									<MultiSelect
										label="Select Company Policy*"
										placeholder="Select company policies"
										options={getSubsidiaryOptions()}
										onChange={(value) => {
											setFieldValue('company_policy', value);
											setFieldTouched('company_policy', true);
										}}
										value={
											isEdit && !touched.company_policy
												? getDefaultComapnies(values?.company_policy)
												: values.company_policy
										}
										name="company_policy"
									/>
									<Button
										type="submit"
										className="btn-soft mr-auto mt-4"
										isLoading={isLoading}
										disabled={isLoading || isEqual(values, state)}
									>
										{isEdit ? 'Save Changes' : 'Add Leave Category'}
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

AddCategory.propTypes = propTypes;
const mapStateToProps = createStructuredSelector({
	isLoading: selectisLoadingCategory,
	policies: selectAllCompanyPolicy,
});
export default connect(mapStateToProps, {
	addCategory,
	editCategory,
	getLeaveById,
	getAllLeaveCategory,
	getAllCompanyPolicy,
})(AddCategory);
