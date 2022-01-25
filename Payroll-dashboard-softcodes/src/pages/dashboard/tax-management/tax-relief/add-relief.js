/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';

/* -------------------------- Internal Dependencies ------------------------- */
import Button from 'components/button';
import Input from 'components/input';
import AutoCompleteInput from 'components/autocomplete-input';
import Modal, { ModalWrap } from 'components/modal';
import { ReactComponent as Loading } from 'assets/icons/loading.svg';
import CurrencyInput from 'components/masked-input';

import Radio from 'components/radio';
import TextArea from 'components/textarea';
import {
	addTaxRelief,
	editTaxRelief,
	getAllTaxReliefGroups,
} from 'redux/tax-management/actions';
import { getAllPayrolls } from 'redux/payroll/actions';
import { debounce, isEmpty } from 'codewonders-helpers';
import { useMount } from 'broad-state';
import { createStructuredSelector } from 'reselect';
import {
	selectAllTaxReliefGroups,
	selectisLoadingTaxReliefGroup,
	selectisLoadingTaxRelief,
} from 'redux/tax-management/selectors';
import { selectisLoading, selectAllPayroll } from 'redux/payroll/selectors';
import { connect } from 'react-redux';
import Select, { MultiSelect } from 'components/select';

/* ---------------------------- AddPayroll PropTypes --------------------------- */
const propTypes = {
	show: PropTypes.bool,
	closeModal: PropTypes.func,
	isLoadingGroups: PropTypes.bool,
	isLoading: PropTypes.bool,
	isEdit: PropTypes.bool,
};

const AddTaxRelief = ({
	show,
	closeModal,
	isLoadingGroups,
	isLoading,
	isLoadingPayroll,
	isEdit,
	data,
	getAllTaxReliefGroups,
	taxReliefGroups,
	addTaxRelief,
	editTaxRelief,
	getAllPayrolls,
	payroll_data,
}) => {
	const state = isEmpty(data)
		? {
				name: '',
				description: '',
				is_active: 'active',
				calculation_type: '',
				calculation_type_value: '',
				payroll_lines: '',
				relief_group: '',
				is_pension_relief: '',
		  }
		: {
				...data,
				is_active: data?.is_active ? 'active' : 'inactive',
				is_pension_relief: data?.is_pension_relief ? 'active' : 'inactive',
				payroll_lines: data?.payroll_lines,
				relief_group: `${data?.relief_group?.name},${data?.relief_group?.id}`,
		  };
	const [searchGroupTerm, setSearchGroupTerm] = useState('');

	const previousSearchTermRef = useRef('');

	// eslint-disable-next-line
	const search = debounce(async (value) => {
		if (previousSearchTermRef.current === value) {
			try {
				// await refetch();
			} finally {
				await getAllTaxReliefGroups(value);
			}
		}
	}, 500);

	useMount(() => {
		if (isEmpty(taxReliefGroups.results)) {
			getAllTaxReliefGroups('', 1, '', true);
		}
		if (isEmpty(payroll_data.results)) {
			getAllPayrolls('', 1, null, '');
		}
	});

	const getSelectDropdown = (data) => {
		if (!isEmpty(data?.results)) {
			return data.results.map((value) => {
				return {
					value: value.id,
					label: value.name,
				};
			});
		}
		return [];
	};

	const getSelectDefault = (value, options) => {
		let d;
		let formattedData;
		if (!isEmpty(value)) {
			d = value?.filter((option) => {
				return getSelectDropdown(options)?.filter(
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

	return (
		<>
			<Modal
				show={show}
				closeModal={closeModal}
				title={isEdit ? 'Edit Tax Relief' : 'Add New Tax Relief'}
				description="Setup Tax Relief that will be used by your employees. E.g NHF"
			>
				<ModalWrap className="row mr-0">
					<div className="col-md-6">
						<Formik
							initialValues={state}
							// validationSchema={
							// 	state.when_to_pay_months === 'CUSTOM'
							// 		? addPayrollCustomValidation
							// 		: addPayrollValidation
							// }
							onSubmit={async (
								{
									name,
									description,
									is_active,
									calculation_type,
									calculation_type_value,
									payroll_lines,
									relief_group,
									is_pension_relief,
								},
								resetForm
							) => {
								const taxRelief_data = {
									name,
									description,
									calculation_type,
									relief_group: relief_group?.split(',')[1],
									is_active: is_active === 'active' || false,
									is_pension_relief: is_pension_relief === 'active' || false,
								};

								if (['FIXED', 'PERCENTAGE'].includes(calculation_type)) {
									taxRelief_data.calculation_type_value = calculation_type_value;

									if (calculation_type === 'PERCENTAGE') {
										taxRelief_data.payroll_lines = payroll_lines?.map(
											(item) => item.value || item.id
										);
									}
								}

								if (calculation_type === 'FIXED') {
									taxRelief_data.calculation_type_value = parseFloat(
										calculation_type_value.replace(/,/g, '')
									);
								}

								if (!isEdit) {
									try {
										await addTaxRelief?.({
											...taxRelief_data,
										});
										closeModal();
										resetForm();
									} catch (e) {}
								} else {
									try {
										await editTaxRelief?.(data?.id, {
											...taxRelief_data,
										});
										closeModal();
										resetForm();
									} catch (e) {}
								}
							}}
						>
							{({
								values,
								errors,
								touched,
								handleChange,
								setFieldTouched,
								setFieldValue,
								handleBlur,
								handleSubmit,
							}) => (
								<form onSubmit={handleSubmit}>
									<div className="row">
										<div className="col-md-12">
											<Input
												hasStrip
												id="name"
												name="name"
												type="text"
												label="Name*"
												placeholder="Enter name of tax relief"
												value={values.name}
												onChange={handleChange}
												disabled={isEdit === 'view'}
												onBlur={handleBlur}
												errorMessage={errors.name}
												isInvalid={errors.name && touched.name}
											/>
										</div>

										<div className="col-md-12">
											<TextArea
												hasStrip
												id="description"
												name="description"
												label="Description"
												placeholder="Enter description"
												value={values.description}
												onChange={handleChange}
												disabled={isEdit === 'view'}
												onBlur={handleBlur}
												errorMessage={errors.description}
												isInvalid={errors.description && touched.description}
											/>
										</div>
										<div className="col-md-6">
											<label className="mb-3">Status*</label>
											<div className="d-flex flex-wrap mb-3">
												<Radio
													name="is_active"
													type="radio"
													checked={values.is_active === 'active'}
													value="active"
													onChange={() => setFieldValue('is_active', 'active')}
													disabled={isEdit === 'view'}
												>
													{' '}
													<p className="radio">Active</p>
												</Radio>
												<Radio
													name="is_active"
													type="radio"
													checked={values.is_active === 'inactive'}
													value="inactive"
													onChange={() =>
														setFieldValue('is_active', 'inactive')
													}
													disabled={isEdit === 'view'}
												>
													{' '}
													<p className="radio">Inactive</p>
												</Radio>
											</div>
										</div>
										<div className="col-md-6">
											<AutoCompleteInput
												hasStrip
												id="relief_group"
												name="relief_group"
												type="text"
												label="Select Tax Relief Group*"
												placeholder="Search and Select tax relief group to add item"
												value={
													searchGroupTerm || state.relief_group?.split(',')[0]
												}
												onChange={(e) => {
													setSearchGroupTerm(e.target.value);
													previousSearchTermRef.current = e.target.value;
													search(e.target.value);
												}}
												activeClassName={
													searchGroupTerm &&
													searchGroupTerm ===
														values?.relief_group?.split(',')[0]
												}
												onBlur={handleBlur}
												errorMessage={errors.relief_group}
												isInvalid={errors.relief_group && touched.relief_group}
											>
												{' '}
												{!isLoadingGroups ? (
													<>
														{!isEmpty(taxReliefGroups?.results) ? (
															<>
																{taxReliefGroups?.results?.map(
																	(relief_data) => (
																		<button
																			onClick={(e) => {
																				e.preventDefault();
																				setSearchGroupTerm(
																					`${relief_data?.name}`
																				);
																				setFieldValue(
																					'relief_group',
																					`${relief_data?.name},${relief_data?.id}`
																				);
																			}}
																			className="button"
																		>
																			<p>{relief_data?.name}</p>
																		</button>
																	)
																)}
															</>
														) : (
															<p className="mx-2 text-center">
																No relief group found
															</p>
														)}
													</>
												) : (
													<Loading />
												)}
											</AutoCompleteInput>
										</div>
										<div className="col-md-6">
											<div className="row">
												<div className="col-md">
													<Select
														hasStrip
														id="calculation_type"
														name="calculation_type"
														label="Calculation*"
														value={values.calculation_type}
														onChange={handleChange}
														disabled={isEdit === 'view'}
														onBlur={handleBlur}
														errorMessage={errors.calculation_type}
														isInvalid={
															errors.calculation_type &&
															touched.calculation_type
														}
														showTooltip
														tooltipTitle="What does this mean?"
														tooltipContent={
															<>
																<p>
																	The calculation types determine how the tax
																	relief should be calculated
																</p>
																<ul>
																	<li>Percentage:</li> This gets the percentage
																	value of the payroll elements set to determine
																	its value. E.g NHF can be 2.5% of Basic.
																	<li>Fixed:</li> This is a flat value that will
																	be used as it is
																	<li>None:</li> This gives you the ability to
																	manually set the value for each employee
																</ul>
															</>
														}
													>
														<option>--Choose a calculation type--</option>
														<option value="PERCENTAGE">Percentage</option>
														<option value="FIXED">Fixed</option>
														<option value="NONE">None</option>
													</Select>
												</div>
												{['PERCENTAGE'].includes(values?.calculation_type) ? (
													<div className="col-md-7">
														<Input
															hasStrip
															id="calculation_type_value"
															name="calculation_type_value"
															type="number"
															label="Amount*"
															placeholder="Amount"
															value={values.calculation_type_value}
															onChange={handleChange}
															disabled={isEdit === 'view'}
															onBlur={handleBlur}
															errorMessage={errors.calculation_type_value}
															isInvalid={
																errors.calculation_type_value &&
																touched.calculation_type_value
															}
														/>
													</div>
												) : null}
												{['FIXED'].includes(values?.calculation_type) ? (
													<div className="col-md-7">
														<CurrencyInput
															placeholder="Amount"
															label="Amount*"
															onChange={handleChange}
															disabled={isEdit === 'view'}
															onBlur={handleBlur}
															id="calculation_type_value"
															name="calculation_type_value"
															value={values.calculation_type_value}
															errorMessage={errors.calculation_type_value}
															isInvalid={
																errors.calculation_type_value &&
																touched.calculation_type_value
															}
														/>
													</div>
												) : null}
											</div>
										</div>
										{values?.calculation_type === 'PERCENTAGE' && (
											<div className="col-md-6">
												<MultiSelect
													label="Payroll Elements"
													placeholder="Select payroll elements"
													options={getSelectDropdown(payroll_data)}
													onChange={(value) => {
														setFieldValue('payroll_lines', value);
														setFieldTouched('payroll_lines', true);
													}}
													value={
														isEdit && !touched.payroll_lines
															? getSelectDefault(
																	values?.payroll_lines,
																	payroll_data
															  )
															: values.payroll_lines
													}
													name="payroll_lines"
												/>
											</div>
										)}
									</div>
									{isEdit === 'view' ? (
										<Button
											type="button"
											className="btn-soft mr-auto mt-4"
											onClick={closeModal}
										>
											Cancel View
										</Button>
									) : (
										<Button
											type="submit"
											className="btn-soft mr-auto mt-4"
											isLoading={isLoading}
											disabled={isLoading}
										>
											{isEdit ? 'Save Changes' : 'Add Tax Relief'}
										</Button>
									)}
								</form>
							)}
						</Formik>
					</div>
				</ModalWrap>
			</Modal>
		</>
	);
};

AddTaxRelief.propTypes = propTypes;

const mapStateToProps = createStructuredSelector({
	isLoadingGroups: selectisLoadingTaxReliefGroup,
	taxReliefGroups: selectAllTaxReliefGroups,
	isLoading: selectisLoadingTaxRelief,
	isLoadingPayroll: selectisLoading,
	payroll_data: selectAllPayroll,
});
export default connect(mapStateToProps, {
	addTaxRelief,
	editTaxRelief,
	getAllTaxReliefGroups,
	getAllPayrolls,
})(AddTaxRelief);
