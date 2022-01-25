/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';

/* -------------------------- Internal Dependencies ------------------------- */
import Button from 'components/button';
import Input from 'components/input';
import Modal, { ModalWrap } from 'components/modal';

import { addPolicyValidation } from 'utils/validation-schema';
import Radio from 'components/radio';
import CheckBox from 'components/checkbox';
import TextArea from 'components/textarea';
import Select, { MultiSelect } from 'components/select';
import { debounce, isEmpty } from 'codewonders-helpers';
import { getAllSubsidiary } from 'redux/subsidiary/actions';
import {
	addCompanyPolicy,
	editCompanyPolicy,
} from 'redux/company-policy/actions';
import { useMount } from 'broad-state';
import { connect } from 'react-redux';
import { selectisLoadingCompanyPolicy } from 'redux/company-policy/selectors';
import {
	selectAllSubsidiaries,
	selectisLoading,
} from 'redux/subsidiary/selectors';
import { createStructuredSelector } from 'reselect';

/* ---------------------------- AddRuleInfo PropTypes --------------------------- */
const propTypes = {
	show: PropTypes.bool,
	closeModal: PropTypes.func,
	isLoading: PropTypes.bool,
	isEdit: PropTypes.bool,
};

const AddRuleInfo = ({
	show,
	closeModal,
	isLoading,
	isEdit,
	data,
	subsidiaries,
	getAllSubsidiary,
	addCompanyPolicy,
	editCompanyPolicy,
}) => {
	const state = isEmpty(data)
		? {
				name: '',
				description: '',
				is_active: 'active',
				payment_cycle: '',
				works_monday: true,
				works_tuesday: true,
				works_wednesday: true,
				works_thursday: true,
				works_friday: true,
				works_saturday: false,
				works_sunday: false,
				statutory_tax_year_start: '',
				statutory_tax_year_end: '',
				probation_months: '',
				hours_per_week: '',
				hours_per_day: '',
				hours_per_month: '',
				company: '',
		  }
		: {
				...data,
				company: data?.company,
				is_active: data?.is_active ? 'active' : 'inactive',
		  };

	const previousSearchTermRef = useRef('');
	// eslint-disable-next-line
	const search = debounce(async (value) => {
		if (previousSearchTermRef.current === value) {
			try {
				// await refetch();
			} finally {
				await getAllSubsidiary(value);
			}
		}
	}, 500);

	useMount(() => {
		if (isEmpty(subsidiaries?.results)) {
			getAllSubsidiary('', 1, '', true);
		}
	});

	const getSubsidiaryOptions = () => {
		if (!isEmpty(subsidiaries?.results)) {
			return subsidiaries.results.map((data) => {
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
	return (
		<>
			<Modal
				show={show}
				closeModal={closeModal}
				title={isEdit ? 'Edit Policy' : 'Add Policy'}
				description="Set your company policy that other properties should inherit from."
			>
				<ModalWrap className="row mr-0">
					<div className="col-md-6">
						<Formik
							initialValues={state}
							validationSchema={addPolicyValidation}
							onSubmit={async (
								{
									name,
									description,
									is_active,
									payment_cycle,
									works_monday,
									works_tuesday,
									works_wednesday,
									works_thursday,
									works_friday,
									works_saturday,
									works_sunday,
									statutory_tax_year_start,
									statutory_tax_year_end,
									probation_months,
									hours_per_week,
									hours_per_day,
									hours_per_month,
									company,
								},
								resetForm
							) => {
								const rule_data = {
									name,
									description,
									is_active: is_active === 'active' || false,
									payment_cycle,
									works_monday,
									works_tuesday,
									works_wednesday,
									works_thursday,
									works_friday,
									works_saturday,
									works_sunday,
									statutory_tax_year_start: new Date(statutory_tax_year_start),
									statutory_tax_year_end: new Date(statutory_tax_year_end),
									probation_months,
									hours_per_week,
									hours_per_day,
									hours_per_month,
									company,
								};
								if (!isEdit) {
									try {
										await addCompanyPolicy?.({
											...rule_data,
											company: company.map((item) => item.value),
										});
										closeModal();
										resetForm({});
									} catch (e) {}
								} else {
									try {
										await editCompanyPolicy?.(data?.id, {
											...rule_data,
											company: company.map((item) => item.value || item.id),
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
												placeholder="Enter name of Policy"
												value={values.name}
												onChange={handleChange}
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
												onBlur={handleBlur}
												errorMessage={errors.description}
												isInvalid={errors.description && touched.description}
											/>
										</div>
										<div className="col-md-12">
											<label className="mb-3">Status</label>
											<div className="d-flex flex-wrap mb-3">
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
													onChange={() =>
														setFieldValue('is_active', 'inactive')
													}
												>
													{' '}
													<p className="radio">Inactive</p>
												</Radio>
											</div>
										</div>
										<div className="col-md-12">
											<Select
												hasStrip
												id="payment_cycle"
												name="payment_cycle"
												label="Select Payment Cycle*"
												value={values.payment_cycle}
												onChange={handleChange}
												onBlur={handleBlur}
												errorMessage={errors.payment_cycle}
												isInvalid={
													errors.payment_cycle && touched.payment_cycle
												}
											>
												<option>-- Click to select a payment cycle --</option>
												<option value="DAILY">Daily</option>
												<option value="WEEKLY">Weekly</option>
												<option value="FORTNIGHTLY">For Nightly</option>
												<option value="MONTHLY">Monthly</option>
												<option value="YEARLY">Yearly</option>
											</Select>
										</div>
										<div className="col-md-12">
											<label className="mb-3">Select work days</label>
											<div className="d-flex flex-wrap mb-3">
												<CheckBox
													name="works_monday"
													checked={values.works_monday}
													value={!values.works_monday}
													onChange={() =>
														setFieldValue('works_monday', !values.works_monday)
													}
												>
													{' '}
													<p className="radio">Monday</p>
												</CheckBox>
												<CheckBox
													name="works_tuesday"
													checked={values.works_tuesday}
													value={!values.works_tuesday}
													onChange={() =>
														setFieldValue(
															'works_tuesday',
															!values.works_tuesday
														)
													}
												>
													{' '}
													<p className="radio">Tuesday</p>
												</CheckBox>
												<CheckBox
													name="works_wednesday"
													checked={values.works_wednesday}
													value={!values.works_wednesday}
													onChange={() =>
														setFieldValue(
															'works_wednesday',
															!values.works_wednesday
														)
													}
												>
													{' '}
													<p className="radio">Wednesday</p>
												</CheckBox>
												<CheckBox
													name="works_thursday"
													checked={values.works_thursday}
													value={!values.works_thursday}
													onChange={() =>
														setFieldValue(
															'works_thursday',
															!values.works_thursday
														)
													}
												>
													{' '}
													<p className="radio">Thursday</p>
												</CheckBox>
												<CheckBox
													name="works_friday"
													checked={values.works_friday}
													value={!values.works_friday}
													onChange={() =>
														setFieldValue('works_friday', !values.works_friday)
													}
												>
													{' '}
													<p className="radio">Friday</p>
												</CheckBox>
												<CheckBox
													name="works_saturday"
													checked={values.works_saturday}
													value={!values.works_saturday}
													onChange={() =>
														setFieldValue(
															'works_saturday',
															!values.works_saturday
														)
													}
												>
													{' '}
													<p className="radio">Saturday</p>
												</CheckBox>
												<CheckBox
													name="works_sunday"
													checked={values.works_sunday}
													value={!values.works_sunday}
													onChange={() =>
														setFieldValue('works_sunday', !values.works_sunday)
													}
												>
													{' '}
													<p className="radio">Sunday</p>
												</CheckBox>
											</div>
										</div>
										<div className="col-md-4">
											<Input
												hasStrip
												id="hours_per_day"
												name="hours_per_day"
												type="number"
												label="Number of work hours per day"
												placeholder="Number of work hours per day"
												value={values.hours_per_day}
												onChange={handleChange}
												onBlur={handleBlur}
												errorMessage={errors.hours_per_day}
												isInvalid={
													errors.hours_per_day && touched.hours_per_day
												}
											/>
										</div>
										<div className="col-md-4">
											<Input
												hasStrip
												id="hours_per_week"
												name="hours_per_week"
												type="number"
												label="Number of work hours per week"
												placeholder="Number of work hours per week"
												value={values.hours_per_week}
												onChange={handleChange}
												onBlur={handleBlur}
												errorMessage={errors.hours_per_week}
												isInvalid={
													errors.hours_per_week && touched.hours_per_week
												}
											/>
										</div>
										<div className="col-md-4">
											<Input
												hasStrip
												id="hours_per_month"
												name="hours_per_month"
												type="number"
												label="Number of work hours per month"
												placeholder="Number of work hours per month"
												value={values.hours_per_month}
												onChange={handleChange}
												onBlur={handleBlur}
												errorMessage={errors.hours_per_month}
												isInvalid={
													errors.hours_per_month && touched.hours_per_month
												}
											/>
										</div>
										<div className="col-md-6">
											<Input
												hasStrip
												id="statutory_tax_year_start"
												name="statutory_tax_year_start"
												type="date"
												format="yyyy-mm-dd"
												label="Statutory tax year start*"
												placeholder="Statutory tax year start (mm/dd/yyyy)"
												value={values.statutory_tax_year_start}
												onChange={handleChange}
												onBlur={handleBlur}
												errorMessage={errors.statutory_tax_year_start}
												isInvalid={
													errors.statutory_tax_year_start &&
													touched.statutory_tax_year_start
												}
											/>
										</div>
										<div className="col-md-6">
											<Input
												hasStrip
												id="statutory_tax_year_end"
												name="statutory_tax_year_end"
												type="date"
												format="yyyy-mm-dd"
												label="Statutory tax year end*"
												placeholder="Statutory tax year end (mm/dd/yyyy)"
												value={values.statutory_tax_year_end}
												onChange={handleChange}
												onBlur={handleBlur}
												errorMessage={errors.statutory_tax_year_end}
												isInvalid={
													errors.statutory_tax_year_end &&
													touched.statutory_tax_year_end
												}
											/>
										</div>
										<div className="col-md-12">
											<Input
												hasStrip
												id="probation_months"
												name="probation_months"
												type="number"
												label="Number of probation months (this is how long an employee can be in probation after being employed)"
												placeholder="Enter number of probation months"
												value={values.probation_months}
												onChange={handleChange}
												onBlur={handleBlur}
												errorMessage={errors.probation_months}
												isInvalid={
													errors.probation_months && touched.probation_months
												}
											/>
										</div>
										{console.log(values)}
										<div className="col-md-12">
											<MultiSelect
												label="Select Companies*"
												placeholder="Select companies"
												options={getSubsidiaryOptions()}
												onChange={(value) => {
													setFieldValue('company', value);
													setFieldTouched('company', true);
												}}
												value={
													isEdit && !touched.company
														? getDefaultComapnies(values?.company)
														: values.company
												}
												name="company"
											/>
										</div>
									</div>

									<Button
										type="submit"
										className="btn-soft mr-auto mt-4"
										isLoading={isLoading}
										disabled={isLoading}
									>
										{isEdit ? 'Save Changes' : 'Add Policy'}
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

AddRuleInfo.propTypes = propTypes;

const mapStateToProps = createStructuredSelector({
	isLoading: selectisLoadingCompanyPolicy,
	subsidiaries: selectAllSubsidiaries,
	isLoadingSubsidiary: selectisLoading,
});
export default connect(mapStateToProps, {
	addCompanyPolicy,
	editCompanyPolicy,
	getAllSubsidiary,
})(AddRuleInfo);
