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
import { headValidation } from 'utils/validation-schema';
import { createStructuredSelector } from 'reselect';
import { addItemOrHead, editItemOrHead } from 'redux/company-structure/actions';
import { getAllCompanyPolicy } from 'redux/company-policy/actions';
import { selectisLoading } from 'redux/company-structure/selectors';
import { selectAllCompanyPolicy } from 'redux/company-policy/selectors';
import isEmpty from 'codewonders-helpers/bundle-cjs/helpers/is-empty';
import { useParams } from 'react-router-dom';
import { MultiSelect } from 'components/select';
import { useMount } from 'broad-state';

const propTypes = {
	show: PropTypes.bool,
	closeModal: PropTypes.func,
	addItemOrHead: PropTypes.func,
	data: PropTypes.object,
	isLoading: PropTypes.bool,
	isEdit: PropTypes.bool,
	getAllCompanyPolicy: PropTypes.func,
	policies: PropTypes.object,
};

const AddHead = ({
	show,
	closeModal,
	isLoading,
	addItemOrHead,
	editItemOrHead,
	isEdit,
	data,
	getAllCompanyPolicy,
	policies,
}) => {
	const { id } = useParams();

	useMount(() => {
		if (isEmpty(policies?.results)) {
			getAllCompanyPolicy('', 1, '', true);
		}
	});

	const getPolicyOptions = () => {
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

	const getDefaultPolicies = (value) => {
		let d;
		let formattedData;
		if (!isEmpty(value)) {
			d = value?.filter((option) => {
				return getPolicyOptions()?.filter((data) => data.id === option.value);
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
				title={isEdit ? 'Edit Head' : 'Add New Head'}
				description="Create your company structure's top hierarchy here. E.g Department, Locations"
			>
				<ModalWrap>
					<div className="col-md-6">
						<Formik
							initialValues={state}
							enableReinitialize
							validationSchema={headValidation}
							onSubmit={async (
								{ name, description, is_active, company_policy },
								resetForm
							) => {
								if (!isEdit) {
									try {
										await addItemOrHead?.({
											name,
											description,
											is_active: is_active === 'active' || false,
											is_header: true,
											company_policy: company_policy.map((item) => item.value),
										});
										closeModal();
										resetForm({});
									} catch (e) {}
								} else {
									try {
										await editItemOrHead?.(
											data?.id,
											{
												name,
												description,
												is_active: is_active === 'active' || false,
												is_header: true,
												company_policy: company_policy.map(
													(item) => item.value || item.id
												),
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
								setFieldTouched,
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
										placeholder="Enter name of the head"
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
										placeholder="Select Policies"
										options={getPolicyOptions()}
										onChange={(value) => {
											setFieldValue('company_policy', value);
											setFieldTouched('company_policy', true);
										}}
										value={
											isEdit && !touched.company_policy
												? getDefaultPolicies(values?.company_policy)
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
										{isEdit ? 'Save Changes' : 'Add Head'}
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

AddHead.propTypes = propTypes;
const mapStateToProps = createStructuredSelector({
	isLoading: selectisLoading,
	policies: selectAllCompanyPolicy,
});
export default connect(mapStateToProps, {
	addItemOrHead,
	editItemOrHead,
	getAllCompanyPolicy,
})(AddHead);
