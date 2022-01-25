/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import { isEqual, debounce } from 'lodash';

/* -------------------------- Internal Dependencies ------------------------- */
import Button from 'components/button';
import Input, { ErrorText } from 'components/input';
import AutoCompleteInput from 'components/autocomplete-input';
import Modal, { ModalWrap } from 'components/modal';
import Radio from 'components/radio';
import { MultiSelect } from 'components/select';
import { createStructuredSelector } from 'reselect';
import {
	selectAllEmployees,
	selectisLoading as selectEmployeeLoading,
} from 'redux/employee/selectors';
import { selectisLoading } from 'redux/payroll/selectors';
import { addLoan, editLoan } from 'redux/payroll/actions';
import isEmpty from 'codewonders-helpers/bundle-cjs/helpers/is-empty';
import { ReactComponent as Loading } from 'assets/icons/loading.svg';
import { getAllEmployees } from 'redux/employee/actions';
import { useParams } from 'react-router-dom';
import { MONTHS } from '../components/months';

/* ---------------------------- AddPayrollCategories PropTypes --------------------------- */
const propTypes = {
	show: PropTypes.bool,
	closeModal: PropTypes.func,
	data: PropTypes.object,
	isLoadingEmployee: PropTypes.bool,
	isEdit: PropTypes.bool,
	editLoan: PropTypes.func,
};

const AddLoan = ({
	show,
	closeModal,
	isLoadingEmployee,
	isLoading,
	addLoan,
	editLoan,
	getAllEmployees,
	employees,
	isEdit,
	data,
}) => {
	const { id } = useParams();
	const [searchTerm, setSearchTerm] = useState('');
	const previousSearchTermRef = useRef('');
	const search = debounce(async (value) => {
		if (previousSearchTermRef.current === value) {
			try {
				// await refetch();
			} finally {
				await getAllEmployees(value);
			}
		}
	}, 500);

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

	const state = isEmpty(data)
		? {
				employee: '',
				amount: '',
				interest_rate: '',
				start_date: '',
				end_date: '',
				when_to_pay: 'MONTHLY',
				when_to_pay_months: '',
				is_active: 'active',
		  }
		: {
				...data,
				is_active: data?.is_active ? 'active' : 'inactive',
				employee: `${data?.employee?.first_name},${data?.employee?.id}`,
		  };

	return (
		<>
			<Modal
				show={show}
				closeModal={closeModal}
				title={isEdit ? 'Edit Loan' : 'Add New Loan'}
			>
				<ModalWrap>
					<div className="row">
						<Formik
							initialValues={state}
							enableReinitialize
							// validationSchema={headValidation}
							onSubmit={async (
								{
									employee,
									amount,
									interest_rate,
									start_date,
									end_date,
									when_to_pay,
									when_to_pay_months,
									is_active,
								},
								resetForm
							) => {
								if (!isEdit) {
									try {
										await addLoan({
											employee: employee.split(',')[1],
											amount,
											interest_rate,
											start_date,
											end_date,
											when_to_pay,
											when_to_pay_months: when_to_pay_months || [],
											is_active: is_active === 'active' || false,
										});
										closeModal();
										resetForm({});
									} catch (e) {}
								} else {
									try {
										await editLoan(
											data?.id,
											{
												employee: employee.split(',')[1],
												amount,
												interest_rate,
												start_date,
												end_date,
												when_to_pay,
												when_to_pay_months,
												is_active: is_active === 'active' || false,
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
								setFieldTouched,
								handleBlur,
								handleSubmit,
							}) => (
								<form onSubmit={handleSubmit}>
									<div className="col-sm-6 col-md-6">
										<AutoCompleteInput
											hasStrip
											id="employee"
											name="employee"
											type="text"
											label="Select Employee*"
											placeholder="Search and Select employee to add item"
											value={searchTerm || state.employee?.split(',')[0]}
											onChange={(e) => {
												setSearchTerm(e.target.value);
												previousSearchTermRef.current = e.target.value;
												search(e.target.value);
											}}
											activeClassName={
												searchTerm &&
												searchTerm === values?.employee?.split(',')[0]
											}
											onBlur={handleBlur}
											errorMessage={errors.employee}
											isInvalid={errors.employee && touched.employee}
										>
											{' '}
											{!isLoadingEmployee ? (
												<>
													{!isEmpty(employees?.results) ? (
														<>
															{employees?.results?.map((employee) => (
																// eslint-disable-next-line react/button-has-type
																<button
																	onClick={(e) => {
																		e.preventDefault();
																		setSearchTerm(`${employee?.first_name}`);
																		setFieldValue(
																			'employee',
																			`${employee?.first_name},${employee?.id}`
																		);
																	}}
																	className="button"
																>
																	<p>
																		{employee?.first_name} {employee?.last_name}
																	</p>
																</button>
															))}
														</>
													) : (
														<p className="mx-2 text-center">
															No Employee Found
														</p>
													)}
												</>
											) : (
												<Loading />
											)}
										</AutoCompleteInput>
									</div>

									<div className="col-md-6 col-sm-6">
										<div className="row">
											<div className="col-md-6 col-sm-6">
												<Input
													hasStrip
													id="amount"
													name="amount"
													type="number"
													label="Loan Amount*"
													placeholder="Amount"
													value={values.amount}
													onChange={handleChange}
													disabled={isEdit === 'view'}
													onBlur={handleBlur}
													errorMessage={errors.amount}
													isInvalid={errors.amount && touched.amount}
												/>
											</div>
											<div className="col-md-6 col-sm-6">
												<Input
													hasStrip
													id="interest_rate"
													name="interest_rate"
													type="number"
													label="Interest Rate*"
													placeholder="Interest rate e.g 0"
													value={values.interest_rate}
													onChange={handleChange}
													disabled={isEdit === 'view'}
													onBlur={handleBlur}
													errorMessage={errors.interest_rate}
													isInvalid={
														errors.interest_rate && touched.interest_rate
													}
												/>
											</div>
										</div>
									</div>
									<div className="col-md-6 col-sm-6">
										<div className="row">
											<div className="col-md-6">
												<Input
													hasStrip
													id="start_date"
													name="start_date"
													type="date"
													label="Start Date*"
													placeholder="Enter Start Date"
													value={values.start_date}
													onChange={handleChange}
													onBlur={handleBlur}
													errorMessage={errors.start_date}
													isInvalid={errors.start_date && touched.start_date}
												/>
											</div>
											<div className="col-md-6">
												<Input
													hasStrip
													id="end_date"
													name="end_date"
													type="date"
													label="End Date*"
													placeholder="Enter End Date"
													value={values.end_date}
													onChange={handleChange}
													onBlur={handleBlur}
													errorMessage={errors.end_date}
													isInvalid={errors.end_date && touched.end_date}
												/>
											</div>
										</div>
									</div>
									<div className="col-md-6">
										<div className="row">
											{/* <div className="col-md-6">
												<Select
													hasStrip
													id="when_to_pay"
													name="when_to_pay"
													label="When To Pay"
													value={values.when_to_pay}
													onChange={handleChange}
													onBlur={handleBlur}
													errorMessage={errors.when_to_pay}
													isInvalid={errors.when_to_pay && touched.when_to_pay}
												>
													<option>--Choose When To Pay--</option>
													<option value="MONTHLY">MONTHLY</option>
													<option value="CUSTOM">CUSTOM</option>
												</Select>
											</div> */}
											<div className="col-md-6">
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
										</div>
									</div>
									<div className="col-md-6">
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
									</div>
									<Button
										type="submit"
										className="btn-soft mr-auto mt-4"
										isLoading={isLoading}
										disabled={isLoading || isEqual(values, state)}
									>
										{isEdit ? 'Save Changes' : 'Add Loan'}
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

AddLoan.propTypes = propTypes;
const mapStateToProps = createStructuredSelector({
	isLoadingEmployee: selectEmployeeLoading,
	isLoading: selectisLoading,
	employees: selectAllEmployees,
});
export default connect(mapStateToProps, { getAllEmployees, addLoan, editLoan })(
	AddLoan
);
