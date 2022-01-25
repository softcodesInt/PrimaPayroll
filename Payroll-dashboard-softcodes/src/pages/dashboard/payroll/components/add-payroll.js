import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';

import Button from 'components/button';
import Input, { ErrorText } from 'components/input';
import Modal, { ModalWrap } from 'components/modal';

// import {
// 	addPayrollValidation,
// 	addPayrollCustomValidation,
// } from 'utils/validation-schema';
import Radio from 'components/radio';
import TextArea from 'components/textarea';
import {
	addPayroll,
	editPayroll,
	getAllPayrollCategory,
} from 'redux/payroll/actions';
import { debounce, isEmpty } from 'codewonders-helpers';
import { useMount } from 'broad-state';
import { createStructuredSelector } from 'reselect';
import { selectisLoading, selectAllCategories } from 'redux/payroll/selectors';
import { connect } from 'react-redux';
import { capitalize } from 'utils';
import Select, { MultiSelect } from 'components/select';
import CurrencyInput from 'components/masked-input';
import AddPayrollCategory from '../payroll-categories/add-payroll-category';
import { MONTHS } from './months';

const propTypes = {
	show: PropTypes.bool,
	closeModal: PropTypes.func,
	isLoading: PropTypes.bool,
	isEdit: PropTypes.bool,
	type: PropTypes.string,
};

export const type_map = {
	CONTRIBUTIONS: 'COMPANY_CONTRIBUTION',
	DEDUCTIONS: 'DEDUCTIONS',
	FRINGE_BENEFITS: 'FRINGE_BENEFIT',
	PROVISIONS: 'PROVISIONS',
	ADDITIONS: 'ADDITIONS',
	EARNINGS: 'EARNINGS',
};

const AddPayroll = ({
	show,
	closeModal,
	isLoading,
	isEdit,
	data,
	addPayroll,
	editPayroll,
	type,
	getAllPayrollCategory,
	categories,
}) => {
	const state = isEmpty(data)
		? {
				name: '',
				description: '',
				is_active: 'active',
				mandatory: 'yes',
				prorata: 'yes',
				calculation_type: '',
				earning_type: '',
				when_to_pay: '',
				when_to_pay_months: '',
				calculation_type_value: '',
				element_type: type_map[type],
				category: '',
				custom_query: '',
		  }
		: {
				...data,
				is_active: data?.is_active ? 'active' : 'inactive',
				mandatory: data?.mandatory ? 'yes' : 'no',
				prorata: data?.prorata ? 'yes' : 'no',
				category: data?.category?.id,
		  };
	const [showModal, setShow] = useState(false);

	const previousSearchCategoryRef = useRef('');

	// eslint-disable-next-line
	const searchCategory = debounce(async (value) => {
		if (previousSearchCategoryRef.current === value) {
			try {
				// await refetch();
			} finally {
				await getAllPayrollCategory(value);
			}
		}
	}, 500);

	useMount(() => {
		if (isEmpty(categories)) {
			getAllPayrollCategory();
		}
	});

	const getDefaultMonths = (value) => {
		let d;
		let formattedData;
		if (!isEmpty(value)) {
			d = value?.filter((option) => {
				return MONTHS?.filter((data) => data.value === option);
			});
		}
		if (d) {
			formattedData = d.map((data) => {
				return {
					label: data,
					value: data,
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
				title={
					isEdit && isEdit !== 'view' ? (
						`Edit ${capitalize(type?.replace(/[^a-zA-Z ]/g, ' '))}`
					) : isEdit === 'view' ? (
						<>
							View <b>{capitalize(data?.name)}</b>
						</>
					) : (
						`Add ${capitalize(type?.replace(/[^a-zA-Z ]/g, ' '))}`
					)
				}
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
									mandatory,
									prorata,
									calculation_type,
									earning_type,
									when_to_pay,
									when_to_pay_months,
									element_type,
									category,
									calculation_type_value,
									custom_query,
								},
								resetForm
							) => {
								const payroll_data = {
									name,
									description,
									calculation_type,
									earning_type,
									when_to_pay,
									element_type,
									category,
									calculation_type_value: [
										'NONE',
										'CUSTOM',
										'EMPLOYEE_DRIVEN',
									].includes(calculation_type)
										? 0
										: calculation_type_value,
									mandatory: mandatory === 'yes' || false,
									prorata: prorata === 'yes' || false,
									is_active: is_active === 'active' || false,
								};

								if (calculation_type === 'CUSTOM') {
									payroll_data.custom_query = calculation_type_value;
								}

								if (calculation_type === 'FIXED') {
									payroll_data.calculation_type_value = parseFloat(
										calculation_type_value.replace(/,/g, '')
									);
								}

								if (when_to_pay === 'CUSTOM' && !when_to_pay_months) {
									return;
								}

								if (when_to_pay_months) {
									payroll_data.when_to_pay_months = when_to_pay_months.map(
										(item) => item.value || item.id
									);
								}

								if (!isEdit) {
									try {
										await addPayroll?.({
											...payroll_data,
										});
										closeModal();
										resetForm();
									} catch (e) {}
								} else {
									try {
										await editPayroll?.(data?.id, {
											...payroll_data,
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
												placeholder={`Enter name of ${capitalize(
													type?.replace(/[^a-zA-Z ]/g, ' ')
												)}`}
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
																	The calculation types determine how the
																	payroll element will be broken down in
																	employee payslips and payroll reports.
																</p>
																<ul>
																	<li>Percentage:</li> This gets the percentage
																	value of the rates per month to determine its
																	value. E.g Basic Earnings can be 20% of
																	monthly salary.
																	<li>Fixed:</li> This is a flat value that will
																	be used as it is
																	<li>None:</li> This means during transactions,
																	you want to set the value. This is useful for
																	payroll elements with value that changes
																	monthly. Example can be Reimbursement fee
																	<li>Employee Driven:</li> This is useful when
																	you want to manually set the value of a
																	payroll line to each employees
																</ul>
															</>
														}
													>
														<option>--Choose a calculation type--</option>
														<option value="PERCENTAGE">Percentage</option>
														<option value="FIXED">Fixed</option>
														<option value="CUSTOM">Custom</option>
														<option value="NONE">None</option>
														<option value="EMPLOYEE_DRIVEN">
															Employee Driven
														</option>
													</Select>
												</div>
												{values?.calculation_type &&
												![
													'NONE',
													'CUSTOM',
													'FIXED',
													'EMPLOYEE_DRIVEN',
												].includes(values?.calculation_type) ? (
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
												{values?.calculation_type &&
												['FIXED'].includes(values?.calculation_type) ? (
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
												{values?.calculation_type &&
												['CUSTOM'].includes(values?.calculation_type) ? (
													<div className="col-md-12">
														<TextArea
															hasStrip
															id="calculation_type_value"
															name="calculation_type_value"
															label="Custom Query"
															placeholder="Enter Custom Query"
															value={
																isEdit === 'view'
																	? values.custom_query
																	: values.calculation_type_value
															}
															disabled={isEdit === 'view'}
															onChange={handleChange}
															onBlur={handleBlur}
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
										<div className="col-md-6">
											<label className="mb-3">Is it Mandatory?*</label>
											<div className="d-flex flex-wrap mb-3">
												<Radio
													name="mandatory"
													type="radio"
													checked={values.mandatory === 'yes'}
													value="yes"
													onChange={() => setFieldValue('mandatory', 'yes')}
													disabled={isEdit === 'view'}
												>
													{' '}
													<p className="radio">Yes</p>
												</Radio>
												<Radio
													name="mandatory"
													type="radio"
													checked={values.mandatory === 'no'}
													value="no"
													onChange={() => setFieldValue('mandatory', 'no')}
													disabled={isEdit === 'view'}
												>
													{' '}
													<p className="radio">No</p>
												</Radio>
											</div>
										</div>
										{!['DEDUCTIONS'].includes(type) ? (
											<div className="col-md-6">
												<label className="mb-3">
													Is it Pro rata? (should this earnings be prorated, if
													set to yes, it uses the date_engaged for the first
													salary and termination date for the last payment)*
												</label>
												<div className="d-flex flex-wrap mb-3">
													<Radio
														name="prorata"
														type="radio"
														checked={values.prorata === 'yes'}
														value="yes"
														onChange={() => setFieldValue('prorata', 'yes')}
														disabled={isEdit === 'view'}
													>
														{' '}
														<p className="radio">Yes</p>
													</Radio>
													<Radio
														name="prorata"
														type="radio"
														checked={values.prorata === 'no'}
														value="no"
														onChange={() => setFieldValue('prorata', 'no')}
														disabled={isEdit === 'view'}
													>
														{' '}
														<p className="radio">No</p>
													</Radio>
												</div>
											</div>
										) : (
											<></>
										)}
										<div className="col-md-6">
											<Select
												hasStrip
												id="when_to_pay"
												name="when_to_pay"
												label={
													['DEDUCTIONS'].includes(type)
														? `When to Deduct*`
														: 'When to Pay*'
												}
												value={values.when_to_pay}
												onChange={handleChange}
												disabled={isEdit === 'view'}
												onBlur={handleBlur}
												errorMessage={errors.when_to_pay}
												isInvalid={errors.when_to_pay && touched.when_to_pay}
												showTooltip
												tooltipTitle="What does this mean?"
												tooltipContent={
													<>
														<p>
															This determines when this payroll element will be
															effective
														</p>
														<ul>
															<li>ALWAYS:</li> It will always be present.
															<li>BIRTHDAY:</li> This will be effective only on
															employee&lsquo;s birthday.
															<li>DATE ENGAGED:</li> This will be effective on
															employee&lsquo;s anniversary.
															<li>DATE ENGAGED:</li> This will show you a new
															field where you can select single/multiple months.
															It will be effective only on the month(s) selected
														</ul>
													</>
												}
											>
												<option>
													--
													{['DEDUCTIONS'].includes(type)
														? `Choose when to deduct`
														: 'Choose when to pay'}
													--
												</option>
												<option value="ALWAYS">Always</option>
												<option value="BIRTHDAY">Birthdays</option>
												<option value="DATE_ENGAGED">Date Engaged</option>
												<option value="CUSTOM">Custom</option>
											</Select>

											{values.when_to_pay === 'CUSTOM' && (
												<>
													<MultiSelect
														label="Custom Configuration*"
														placeholder="Select all the months"
														options={MONTHS}
														onChange={(value) => {
															setFieldValue('when_to_pay_months', value);
															setFieldTouched('when_to_pay_months', true);
														}}
														value={
															isEdit && !touched.when_to_pay_months
																? getDefaultMonths(values?.when_to_pay_months)
																: values.when_to_pay_months
														}
														name="when_to_pay_months"
													/>
													<ErrorText>{errors.when_to_pay_months}</ErrorText>
												</>
											)}
										</div>

										{!['DEDUCTIONS'].includes(type) ? (
											<div className="col-md-6">
												<Select
													hasStrip
													id="earning_type"
													name="earning_type"
													label="Earning Type"
													value={values.earning_type}
													onChange={handleChange}
													disabled={isEdit === 'view'}
													onBlur={handleBlur}
													errorMessage={errors.earning_type}
													isInvalid={
														errors.earning_type && touched.earning_type
													}
													showTooltip
													tooltipTitle="What does this mean?"
													tooltipContent={
														<>
															<p>
																The Earning Type determines if the earning
																should be taxable
															</p>
															<ul>
																<li>TAXABLE:</li> This means this earning will
																be taxable if the employee has tax applied.
																<li>NON TAXABLE:</li> This means this earning
																will not be taxable and the employee will get
																the full payment
															</ul>
														</>
													}
												>
													<option>--Choose Earning Type--</option>
													{/* <option value="PENSIONABLE">PENSIONABLE</option> */}
													<option value="TAXABLE">TAXABLE</option>
													<option value="NON_TAXABLE">NON TAXABLE</option>
												</Select>
											</div>
										) : (
											<></>
										)}

										<div className="col-md-6">
											<Select
												hasStrip
												id="category"
												name="category"
												label="Payroll Group"
												value={values.category}
												onChange={handleChange}
												onBlur={handleBlur}
												errorMessage={errors.category}
												isInvalid={errors.category && touched.category}
											>
												<option value="">-Select-</option>
												{categories?.results.map((category) => (
													<option value={category.id}>{category.name}</option>
												))}
											</Select>
										</div>
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
											{isEdit
												? 'Save Changes'
												: `Add ${capitalize(
														type?.replace(/[^a-zA-Z ]/g, ' ')
												  )}`}
										</Button>
									)}
								</form>
							)}
						</Formik>
					</div>
				</ModalWrap>
			</Modal>
			<AddPayrollCategory show={showModal} closeModal={() => setShow(false)} />
		</>
	);
};

AddPayroll.propTypes = propTypes;

const mapStateToProps = createStructuredSelector({
	isLoading: selectisLoading,
	categories: selectAllCategories,
});
export default connect(mapStateToProps, {
	addPayroll,
	editPayroll,
	getAllPayrollCategory,
})(AddPayroll);
