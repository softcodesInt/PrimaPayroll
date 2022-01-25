/* eslint-disable no-shadow */
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import styled from 'styled-components';

import Button from 'components/button';
import Input from 'components/input';
import Modal from 'components/modal';
import Radio from 'components/radio';
import TextArea from 'components/textarea';
import { leaveValidation } from 'utils/validation-schema';
import debounce from 'codewonders-helpers/bundle-cjs/helpers/debounce';
import {
	addLeave,
	editLeave,
	getAllLeaveCategory,
	getAllLeaves,
	getLeaveById,
} from 'redux/leave/actions';
import { useMount } from 'broad-state';
import { useParams } from 'react-router-dom';
import isEmpty from 'codewonders-helpers/bundle-cjs/helpers/is-empty';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import {
	selectAllCategories,
	selectisLoading,
	selectisLoadingCategory,
} from 'redux/leave/selectors';
import AutoCompleteInput from 'components/autocomplete-input';
import { ReactComponent as Loading } from 'assets/icons/loading.svg';
import CheckBox from 'components/checkbox';

const propTypes = {
	show: PropTypes.bool,
	closeModal: PropTypes.func,
	isLoading: PropTypes.bool,
	isEdit: PropTypes.bool,
	getLeaveById: PropTypes.func,
	getAllLeaves: PropTypes.func,
	data: PropTypes.shape,
	isLoadingCategory: PropTypes.bool,
	addLeave: PropTypes.func,
	editLeave: PropTypes.func,
	categories: PropTypes.array,
};

const AddLeave = ({
	show,
	closeModal,
	isLoading,
	isEdit,
	data,
	isLoadingCategory,
	addLeave,
	editLeave,
	getLeaveById,
	getAllLeaves,
	categories,
}) => {
	const state = isEmpty(data)
		? {
				name: '',
				description: '',
				entitlement_value: '',
				weekend_apply: false,
				months_prior: '',
				for_female: false,
				for_male: false,
				is_sick_leave: false,
				is_active: 'active',
				category: '',
		  }
		: {
				...data,
				category: `${data?.category?.name},${data?.category?.id}`,
				is_active: data?.is_active ? 'active' : 'inactive',
		  };

	const [searchTerm, setSearchTerm] = useState('');
	const { id } = useParams();
	const previousSearchTermRef = useRef('');
	const search = debounce(async (value) => {
		if (previousSearchTermRef.current === value) {
			try {
				// await refetch();
			} finally {
				await getAllLeaveCategory(value);
			}
		}
	}, 500);

	useMount(() => {
		if (isEmpty(categories)) {
			getAllLeaveCategory();
		}
	});

	return (
		<>
			<Modal
				show={show}
				closeModal={() => {
					closeModal();
					getAllLeaveCategory();
				}}
				title={isEdit ? 'Edit Leave' : 'Add New Leave'}
				description="Create individual leaves with its properties."
			>
				<ModalWrap className="row mr-0">
					<div className="col-md-6">
						<Formik
							initialValues={state}
							validationSchema={leaveValidation}
							onSubmit={async (
								{
									name,
									description,
									entitlement_value,
									weekend_apply,
									months_prior,
									for_female,
									for_male,
									is_active,
									is_sick_leave,
									category,
								},
								resetForm
							) => {
								if (!isEdit) {
									try {
										await addLeave?.({
											name,
											description,
											entitlement_value,
											weekend_apply,
											months_prior,
											for_female,
											for_male,
											is_sick_leave,
											is_active: is_active === 'active' || false,
											category: category?.split(',')[1],
										});
										closeModal();
										resetForm({});
									} catch (e) {}
								} else {
									try {
										await editLeave?.(
											data?.id,
											{
												name,
												description,
												entitlement_value,
												weekend_apply,
												months_prior,
												for_female,
												for_male,
												is_sick_leave,
												is_active: is_active === 'active' || false,
												category: category?.split(',')[1],
											},
											id
										);
										if (id) {
											getLeaveById(id);
										} else {
											getAllLeaves();
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
										placeholder="Enter name of the leave"
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
									<Input
										hasStrip
										id="entitlement_value"
										name="entitlement_value"
										type="number"
										label="Enter entitlement value* (number of days this leave will take)*"
										placeholder=" Enter the number of days this leave will take"
										value={values.entitlement_value}
										onChange={handleChange}
										onBlur={handleBlur}
										errorMessage={errors.entitlement_value}
										isInvalid={
											errors.entitlement_value && touched.entitlement_value
										}
									/>
									<label className="mb-3">
										Gender* (the gender this leave will apply to)
									</label>
									<div className="d-flex flex-wrap mb-3">
										<CheckBox
											name="for_female"
											checked={values.for_female}
											value={!values.for_female}
											onChange={() =>
												setFieldValue('for_female', !values.for_female)
											}
										>
											{' '}
											<p className="radio">Female</p>
										</CheckBox>
										<CheckBox
											name="for_male"
											checked={values.for_male}
											value={!values.for_male}
											onChange={() =>
												setFieldValue('for_male', !values.for_male)
											}
										>
											{' '}
											<p className="radio">Male</p>
										</CheckBox>
									</div>
									<label className="mb-3">Is it Sick Leave</label>
									<div className="d-flex flex-wrap mb-3">
										<CheckBox
											name="is_sick_leave"
											checked={values.is_sick_leave}
											value={!values.is_sick_leave}
											onChange={() =>
												setFieldValue('is_sick_leave', !values.is_sick_leave)
											}
										>
											{' '}
											<p className="radio">Yes</p>
										</CheckBox>
									</div>
									<Input
										hasStrip
										id="months_prior"
										name="months_prior"
										type="number"
										label="Enter number of months of prior engagement* (number of months this the staff needs to be employed before this leave is active) "
										placeholder=" Enter the number of months this leave will take"
										value={values.months_prior}
										onChange={handleChange}
										onBlur={handleBlur}
										errorMessage={errors.months_prior}
										isInvalid={errors.months_prior && touched.months_prior}
									/>
									<label className="mb-3">
										Do weekends apply for this leave?*
									</label>
									<div className="d-flex flex-wrap mb-3">
										<Radio
											name="weekend_apply"
											type="radio"
											checked={values.weekend_apply === true}
											value={true}
											onChange={() => setFieldValue('weekend_apply', true)}
										>
											{' '}
											<p className="radio">Yes</p>
										</Radio>
										<Radio
											name="weekend_apply"
											type="radio"
											checked={values.weekend_apply === false}
											value={false}
											onChange={() => setFieldValue('weekend_apply', false)}
										>
											{' '}
											<p className="radio">No</p>
										</Radio>
									</div>
									<AutoCompleteInput
										hasStrip
										id="category"
										name="category"
										type="text"
										label="Select Leave Category*"
										placeholder="Search and Select leave to add item"
										value={searchTerm || state.category?.split(',')[0]}
										onChange={(e) => {
											setSearchTerm(e.target.value);
											previousSearchTermRef.current = e.target.value;
											search(e.target.value);
										}}
										activeClassName={
											searchTerm &&
											searchTerm === values?.category?.split(',')[0]
										}
										onBlur={handleBlur}
										errorMessage={errors.category}
										isInvalid={errors.category && touched.category}
									>
										{' '}
										{!isLoadingCategory ? (
											<>
												{!isEmpty(categories?.results) ? (
													<>
														{categories?.results?.map((category_data) => (
															<button
																type="button"
																onClick={(e) => {
																	e.preventDefault();
																	setSearchTerm(`${category_data?.name}`);
																	setFieldValue(
																		'category',
																		`${category_data?.name},${category_data?.id}`
																	);
																}}
																className="button"
															>
																<p>{category_data?.name}</p>
															</button>
														))}
													</>
												) : (
													<p className="mx-2 text-center">
														No categories found
													</p>
												)}
											</>
										) : (
											<Loading />
										)}
									</AutoCompleteInput>
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
										disabled={isLoading}
									>
										{isEdit ? 'Save Changes' : 'Add Leave'}
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

export const ModalWrap = styled.div`
	label {
		font-style: normal;
		font-weight: normal;
		font-size: var(--font-accent);
		line-height: 15px;
		/* identical to box height */

		/* Text/Black */

		color: var(--text-black);
	}
	.radio {
		font-style: normal;
		font-weight: normal;
		font-size: 14px;
		line-height: 18px;
		letter-spacing: 0.02em;
		margin-right: 1rem;
		color: #141515;
	}
`;
AddLeave.propTypes = propTypes;
const mapStateToProps = createStructuredSelector({
	isLoading: selectisLoading,
	categories: selectAllCategories,
	isLoadingCategory: selectisLoadingCategory,
});
export default connect(mapStateToProps, {
	addLeave,
	editLeave,
	getAllLeaveCategory,
	getLeaveById,
	getAllLeaves,
})(AddLeave);
