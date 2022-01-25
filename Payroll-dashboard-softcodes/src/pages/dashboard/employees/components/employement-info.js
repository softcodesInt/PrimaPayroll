import React from 'react';
import { useMount } from 'broad-state';
import { createStructuredSelector } from 'reselect';
import { isEmpty } from 'codewonders-helpers';
import { connect } from 'react-redux';

import Loader from 'components/loader';
import Button from 'components/button';
import CurrencyInput from 'components/masked-input';
import Input, { ErrorText } from 'components/input';
import Select, { MultiSelect } from 'components/select';
import CheckBox from 'components/checkbox';
import Radio from 'components/radio';
import {
	getAllBanks,
	getAllJobTitles,
	getAllNatureOfContracts,
	getAllJobGrades,
} from 'redux/settings/actions';
import { getAllHeads } from 'redux/company-structure/actions';
import { getAllRemuneration } from 'redux/payroll/actions';
import {
	selectAllBanks,
	selectAllJobTitles,
	selectAllNatureOfContracts,
	selectAllJobGrades,
	selectisLoading,
} from 'redux/settings/selectors';
import {
	selectAllHeads,
	selectisLoading as selectLoadingHierarchyItems,
} from 'redux/company-structure/selectors';
import {
	selectAllRemuneration,
	selectisLoading as selectLoadingRemuneration,
} from 'redux/payroll/selectors';
import { getAllTaxReliefGroups } from 'redux/tax-management/actions';
import {
	selectAllTaxReliefGroups,
	selectisLoadingTaxReliefGroup,
} from 'redux/tax-management/selectors';

const EmploymentInfoForm = ({
	values,
	errors,
	touched,
	handleChange,
	handleBlur,
	handleSubmit,
	setFieldValue,
	setFieldTouched,

	isLoading,
	isEdit,

	isLoadingSettings,
	getAllBanks,
	getAllJobTitles,
	getAllNatureOfContracts,
	getAllJobGrades,
	banks,
	jobTitles,
	natureOfContracts,
	jobGrades,
	getAllHeads,
	isLoadingHierarchy,
	hierarchy,
	getAllRemuneration,
	isLoadingRemuneration,
	remunerations,
	taxReliefGroups,
	getAllTaxReliefGroups,
	isLoadingTaxReliefGroups,
}) => {
	useMount(() => {
		if (isEmpty(banks)) {
			getAllBanks(`sort_by=active`);
		}
		if (isEmpty(jobTitles)) {
			getAllJobTitles(`sort_by=active`);
		}
		if (isEmpty(hierarchy)) {
			getAllHeads();
		}
		if (isEmpty(remunerations)) {
			getAllRemuneration('', '', 'sort_by=active');
		}
		if (isEmpty(natureOfContracts)) {
			getAllNatureOfContracts(`sort_by=active`);
		}
		if (isEmpty(jobGrades)) {
			getAllJobGrades(`sort_by=active`);
		}
		if (isEmpty(taxReliefGroups)) {
			getAllTaxReliefGroups('', 1, `sort_by=active`);
		}
	});

	const isAPIStillLoading = () => {
		if (isLoadingSettings) return true;
		if (isLoadingHierarchy) return true;
		if (isLoadingRemuneration) return true;
		if (isLoadingTaxReliefGroups) return true;
	};

	const getMultiSelectOptions = (data) => {
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
				return getMultiSelectOptions(options)?.filter(
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
		<form onSubmit={handleSubmit}>
			{isAPIStillLoading() && !isLoading ? (
				<Loader loadingText="Fetching default values and options" />
			) : (
				<>
					<div className="row">
						<div className="col-md-4">
							<Input
								hasStrip
								id="employee_code"
								name="employee_code"
								label="Employee Code*"
								placeholder="Enter Employee code"
								value={values.employee_code}
								onChange={handleChange}
								onBlur={handleBlur}
								errorMessage={errors.employee_code}
								isInvalid={errors.employee_code && touched.employee_code}
							/>
						</div>
						<div className="col-md-4">
							<Input
								hasStrip
								id="date_engaged"
								name="date_engaged"
								type="date"
								label="Date Engaged*"
								placeholder="Enter Date engaged"
								value={values.date_engaged}
								onChange={handleChange}
								onBlur={handleBlur}
								errorMessage={errors.date_engaged}
								isInvalid={errors.date_engaged && touched.date_engaged}
							/>
						</div>
						<div className="col-md-4">
							<Input
								hasStrip
								id="probation_period"
								name="probation_period"
								type="text"
								label="Probation Period (in months)*"
								placeholder="Enter probation period"
								value={values.probation_period}
								onChange={handleChange}
								onBlur={handleBlur}
								errorMessage={errors.probation_period}
								isInvalid={errors.probation_period && touched.probation_period}
							/>
						</div>
					</div>
					<div className="row">
						<div className="col-md-3">
							<Input
								hasStrip
								id="pension_pin"
								name="pension_pin"
								type="text"
								label="Pension Pin"
								placeholder="Enter Pension Pin"
								value={values.pension_pin}
								onChange={handleChange}
								onBlur={handleBlur}
								errorMessage={errors.pension_pin}
								isInvalid={errors.pension_pin && touched.pension_pin}
							/>
						</div>
						<div className="col-md-3">
							<Input
								hasStrip
								id="pension_start_date"
								name="pension_start_date"
								type="date"
								label="Pension Start Date"
								placeholder="Enter Pension Start Date"
								value={values.pension_start_date}
								onChange={handleChange}
								onBlur={handleBlur}
								errorMessage={errors.pension_start_date}
								isInvalid={
									errors.pension_start_date && touched.pension_start_date
								}
							/>
						</div>
						<div className="col-md-3">
							<Input
								hasStrip
								id="tax_identification_number"
								name="tax_identification_number"
								type="text"
								label="Tax Identification Number"
								placeholder="Enter Tax Identification Number"
								value={values.tax_identification_number}
								onChange={handleChange}
								onBlur={handleBlur}
								errorMessage={errors.tax_identification_number}
								isInvalid={
									errors.tax_identification_number &&
									touched.tax_identification_number
								}
							/>
						</div>
						<div className="col-md-3">
							<Input
								hasStrip
								id="nhf"
								name="nhf"
								type="text"
								label="NHF"
								placeholder="Enter National Housing Fund"
								value={values.nhf}
								onChange={handleChange}
								onBlur={handleBlur}
								errorMessage={errors.nhf}
								isInvalid={errors.nhf && touched.nhf}
							/>
						</div>
					</div>
					<div className="row">
						<div className="col-md-4">
							<Input
								hasStrip
								id="email"
								name="email"
								type="email"
								label="Company Email"
								placeholder="Enter company email"
								value={values.email}
								onChange={handleChange}
								onBlur={handleBlur}
								errorMessage={errors.email}
								isInvalid={errors.email && touched.email}
							/>
						</div>
						<div className="col-md-4">
							<Select
								hasStrip
								id="job_title"
								name="job_title"
								label="Job Title*"
								value={values.job_title}
								onChange={handleChange}
								onBlur={handleBlur}
								errorMessage={errors.job_title}
								isInvalid={errors.job_title && touched.job_title}
							>
								<option>--Choose a job title--</option>
								{jobTitles?.results?.map((data) => (
									<option key={data.id} value={data.id}>
										{data.name}
									</option>
								))}
							</Select>
						</div>
						<div className="col-md-4">
							<Select
								hasStrip
								id="nature_of_contract"
								name="nature_of_contract"
								label="Nature of contract*"
								value={values.nature_of_contract}
								onChange={handleChange}
								onBlur={handleBlur}
								errorMessage={errors.nature_of_contract}
								isInvalid={
									errors.nature_of_contract && touched.nature_of_contract
								}
							>
								<option>--Choose a nature of contract--</option>
								{natureOfContracts?.results?.map((data) => (
									<option key={data.id} value={data.id}>
										{data.name}
									</option>
								))}
							</Select>
						</div>
						<div className="col-md-4">
							<Select
								hasStrip
								id="job_grade"
								name="job_grade"
								label="Job Grade*"
								value={values.job_grade}
								onChange={handleChange}
								onBlur={handleBlur}
								errorMessage={errors.job_grade}
								isInvalid={errors.job_grade && touched.job_grade}
							>
								<option>--Choose a job grade--</option>
								{jobGrades?.results?.map((data) => (
									<option key={data.id} value={data.id}>
										{data.name}
									</option>
								))}
							</Select>
						</div>
						<div className="col-md-4">
							<MultiSelect
								label="Hierarchy*"
								placeholder="Select Hierarchies"
								options={getMultiSelectOptions(hierarchy)}
								onChange={(value) => {
									setFieldValue('hierarchy', value);
									setFieldTouched('hierarchy', true);
								}}
								value={
									isEdit && !touched.hierarchy
										? getSelectDefault(values?.hierarchy, hierarchy)
										: values.hierarchy
								}
								name="hierarchy"
							/>
							{errors?.hierarchy ? (
								<ErrorText>{errors?.hierarchy}</ErrorText>
							) : (
								<></>
							)}
						</div>
						<div className="col-md-4">
							<Select
								hasStrip
								id="remuneration"
								name="remuneration"
								label="Remuneration Structure*"
								value={values.remuneration}
								onChange={handleChange}
								onBlur={handleBlur}
								errorMessage={errors.remuneration}
								isInvalid={errors.remuneration && touched.remuneration}
							>
								<option>--Choose a remuneration--</option>
								{remunerations?.results?.map((data) => (
									<option key={data.id} value={data.id}>
										{data.name}
									</option>
								))}
							</Select>
						</div>
					</div>
					<div className="row">
						<div className="col-md-4">
							<Select
								hasStrip
								id="bank"
								name="bank"
								label="Bank*"
								value={values.bank}
								onChange={handleChange}
								onBlur={handleBlur}
								errorMessage={errors.bank}
								isInvalid={errors.bank && touched.bank}
							>
								<option>--Choose a bank--</option>
								{banks?.results?.map((data) => (
									<option key={data.id} value={data.id}>
										{data.name}
									</option>
								))}
							</Select>
						</div>
						<div className="col-md-4">
							<Input
								hasStrip
								id="account_number"
								name="account_number"
								type="text"
								label="Account Number*"
								placeholder="Enter Account Number*"
								value={values.account_number}
								onChange={handleChange}
								onBlur={handleBlur}
								errorMessage={errors.account_number}
								isInvalid={errors.account_number && touched.account_number}
							/>
						</div>
						<div className="col-md-4">
							<Input
								hasStrip
								id="account_name"
								name="account_name"
								type="text"
								label="Account Name*"
								placeholder="Enter Account Name"
								value={values.account_name}
								onChange={handleChange}
								onBlur={handleBlur}
								errorMessage={errors.account_name}
								isInvalid={errors.account_name && touched.account_name}
							/>
						</div>
					</div>
					<div className="row">
						<div className="col-md-4">
							<Input
								hasStrip
								id="hours_per_day"
								name="hours_per_day"
								type="number"
								label="Work hours per day*"
								placeholder="Number of work hours per day"
								value={values.hours_per_day}
								onChange={handleChange}
								onBlur={handleBlur}
								errorMessage={errors.hours_per_day}
								isInvalid={errors.hours_per_day && touched.hours_per_day}
							/>
						</div>
						<div className="col-md-4">
							<Input
								hasStrip
								id="hours_per_week"
								name="hours_per_week"
								type="number"
								label="Work hours per week*"
								placeholder="Number of work hours per week"
								value={values.hours_per_week}
								onChange={handleChange}
								onBlur={handleBlur}
								errorMessage={errors.hours_per_week}
								isInvalid={errors.hours_per_week && touched.hours_per_week}
							/>
						</div>
						<div className="col-md-4">
							<Input
								hasStrip
								id="hours_per_month"
								name="hours_per_month"
								type="number"
								label="Work hours per month*"
								placeholder="Number of work hours per month"
								value={values.hours_per_month}
								onChange={handleChange}
								onBlur={handleBlur}
								errorMessage={errors.hours_per_month}
								isInvalid={errors.hours_per_month && touched.hours_per_month}
							/>
						</div>
					</div>
					<div className="row">
						<div className="col-md-3">
							<CurrencyInput
								placeholder="Rates per hour"
								label="Rates per hour*"
								onChange={handleChange}
								onBlur={handleBlur}
								id="rates_per_hour"
								name="rates_per_hour"
								value={values.rates_per_hour}
								errorMessage={errors.rates_per_hour}
								isInvalid={errors.rates_per_hour && touched.rates_per_hour}
								disabled
							/>
						</div>
						<div className="col-md-3">
							<CurrencyInput
								placeholder="Rates per day"
								label="Rates per day*"
								onChange={handleChange}
								onBlur={handleBlur}
								id="rates_per_day"
								name="rates_per_day"
								value={values.rates_per_day}
								errorMessage={errors.rates_per_day}
								isInvalid={errors.rates_per_day && touched.rates_per_day}
								disabled
							/>
						</div>
						<div className="col-md-3">
							<CurrencyInput
								placeholder="Rates per month"
								label="Rates per month*"
								onChange={(e) => {
									setFieldValue('rates_per_month', e.target.value);
									const rates_per_hour =
										parseFloat(String(e.target.value)?.replace(/,/g, '')) /
										values.hours_per_month;
									setFieldValue(
										'rates_per_hour',
										rates_per_hour?.toFixed(3) || 0
									);
									setFieldValue(
										'rates_per_day',
										(rates_per_hour * values.hours_per_day)?.toFixed(3) || 0
									);
									setFieldValue(
										'rates_per_year',
										(
											parseFloat(String(e.target.value)?.replace(/,/g, '')) * 12
										)?.toFixed(3) || 0
									);
								}}
								onBlur={handleBlur}
								id="rates_per_month"
								name="rates_per_month"
								value={values.rates_per_month}
								errorMessage={errors.rates_per_month}
								isInvalid={errors.rates_per_month && touched.rates_per_month}
							/>
						</div>
						<div className="col-md-3">
							<CurrencyInput
								placeholder="Rates per year"
								label="Rates per year*"
								onChange={handleChange}
								onBlur={handleBlur}
								id="rates_per_year"
								name="rates_per_year"
								value={values.rates_per_year}
								errorMessage={errors.rates_per_year}
								isInvalid={errors.rates_per_year && touched.rates_per_year}
							/>
						</div>
					</div>
					<div className="row">
						<div className="col-md-3">
							<label className="mb-3">Pension Applied*</label>
							<div className="">
								<Radio
									name="pension_applied"
									type="radio"
									checked={values.pension_applied === 'active'}
									value="active"
									onChange={() => setFieldValue('pension_applied', 'active')}
								>
									{' '}
									<p className="radio">Yes</p>
								</Radio>
								<Radio
									name="pension_applied"
									type="radio"
									checked={values.pension_applied === 'inactive'}
									value="inactive"
									onChange={() => setFieldValue('pension_applied', 'inactive')}
								>
									{' '}
									<p className="radio">No</p>
								</Radio>
							</div>
						</div>

						<div className="col-md-3">
							<label className="mb-3">Tax Applied*</label>
							<div className="">
								<Radio
									name="tax_applied"
									type="radio"
									checked={values.tax_applied === 'YES'}
									value="YES"
									onChange={() => setFieldValue('tax_applied', 'YES')}
								>
									{' '}
									<p className="radio">Yes</p>
								</Radio>
								<Radio
									name="tax_applied"
									type="radio"
									checked={values.tax_applied === 'NO'}
									value="NO"
									onChange={() => setFieldValue('tax_applied', 'NO')}
								>
									{' '}
									<p className="radio">No</p>
								</Radio>
								<Radio
									name="tax_applied"
									type="radio"
									checked={values.tax_applied === 'FIXED'}
									value="FIXED"
									onChange={() => setFieldValue('tax_applied', 'FIXED')}
								>
									{' '}
									<p className="radio">Fixed</p>
								</Radio>
							</div>
						</div>
						<div className="col-md-6">
							{values.tax_applied === 'YES' && (
								<Select
									hasStrip
									id="tax_relief"
									name="tax_relief"
									label="Tax Relief Group*"
									value={values.tax_relief}
									onChange={handleChange}
									onBlur={handleBlur}
									errorMessage={errors.tax_relief}
									isInvalid={errors.tax_relief && touched.tax_relief}
								>
									<option>--Choose a tax relief group--</option>
									{taxReliefGroups?.results?.map((data) => (
										<option key={data.id} value={data.id}>
											{data.name}
										</option>
									))}
								</Select>
							)}
							{values.tax_applied === 'FIXED' && (
								<CurrencyInput
									placeholder="Enter fix tax"
									label="Fixed Tax Amount*"
									onChange={handleChange}
									onBlur={handleBlur}
									id="fixed_tax"
									name="fixed_tax"
									value={values.fixed_tax}
									errorMessage={errors.fixed_tax}
									isInvalid={errors.fixed_tax && touched.fixed_tax}
								/>
							)}
						</div>
					</div>

					<div className="row">
						<div className="col-md-12">
							<div className="">
								<label className="mb-3">WorkDays</label>
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
										setFieldValue('works_tuesday', !values.works_tuesday)
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
										setFieldValue('works_wednesday', !values.works_wednesday)
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
										setFieldValue('works_thursday', !values.works_thursday)
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
										setFieldValue('works_saturday', !values.works_saturday)
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
					</div>
					<Button
						type="submit"
						className="btn-soft mr-auto mt-4"
						isLoading={isLoading}
						disabled={isLoading}
					>
						{isEdit ? 'Save Changes' : 'Add Employee Info'}
					</Button>
				</>
			)}
		</form>
	);
};

const mapStateToProps = createStructuredSelector({
	isLoadingSettings: selectisLoading,
	banks: selectAllBanks,
	jobTitles: selectAllJobTitles,
	natureOfContracts: selectAllNatureOfContracts,
	jobGrades: selectAllJobGrades,

	isLoadingHierarchy: selectLoadingHierarchyItems,
	hierarchy: selectAllHeads,

	isLoadingRemuneration: selectLoadingRemuneration,
	remunerations: selectAllRemuneration,

	isLoadingTaxReliefGroups: selectisLoadingTaxReliefGroup,
	taxReliefGroups: selectAllTaxReliefGroups,
});
export default connect(mapStateToProps, {
	getAllJobTitles,
	getAllBanks,
	getAllNatureOfContracts,
	getAllHeads,
	getAllRemuneration,
	getAllJobGrades,
	getAllTaxReliefGroups,
})(EmploymentInfoForm);
