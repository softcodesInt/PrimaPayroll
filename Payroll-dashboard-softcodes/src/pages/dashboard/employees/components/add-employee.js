/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React from 'react';
import styled from 'styled-components';
import { Formik } from 'formik';

/* -------------------------- Internal Dependencies ------------------------- */
import NavLayout from 'components/layout/dashboard-layout/navbar';

/* --------------------------- Image Dependencies --------------------------- */
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectAllCompanyPolicy } from 'redux/company-policy/selectors';
import {
	addEmployee,
	editEmployee,
	getEmployeeById,
} from 'redux/employee/actions';
import { selectisLoading, selectEmployee } from 'redux/employee/selectors';
import { useParams } from 'react-router-dom';
import { useMount } from 'broad-state';
import Loader from 'components/loader';
import {
	employeeInfoValidation,
	companyPolicyValidation,
	employmentInfoValidation,
	leaveCtaegoryValidation,
} from 'utils/validation-schema';
import { getQueryParams } from 'utils';
import EmployeeFormStepper from './steppers';
import EmployeeInfoForm from './employee-info';
import CompanyPolicyInfoForm from './company-rule-info';
import EmploymentInfoForm from './employement-info';
import PayslipFormDisplay from './payslip-form';
import LeaveSetupForm from './leave-setup';
import { DashboardSubWrapper } from '../../company-structure';

const schemaObj = {
	0: employeeInfoValidation,
	1: companyPolicyValidation,
	2: employmentInfoValidation,
	4: leaveCtaegoryValidation,
};

const AddEmployee = ({
	isLoading,
	addEmployee,
	editEmployee,
	company_policies,
	getEmployeeById,
	employee,
}) => {
	const isEdit = !!useParams()?.id;
	const employeeId = useParams().id;

	useMount(() => {
		if (employeeId) {
			getEmployeeById(employeeId);
		}
	});
	const queryParams = getQueryParams();

	const employmentInfoDefaultPolicyValues = () => {
		const data = JSON.parse(localStorage.getItem('selectedPolicy'));
		return {
			probation_period: employee?.probation_period || data?.probation_months,
			hours_per_day: employee?.hours_per_day || data?.hours_per_day,
			hours_per_month: employee?.hours_per_month || data?.hours_per_month,
			hours_per_week: employee?.hours_per_week || data?.hours_per_week,
			works_monday: employee?.works_monday || data?.works_monday,
			works_tuesday: employee?.works_tuesday || data?.works_tuesday,
			works_wednesday: employee?.works_wednesday || data?.works_wednesday,
			works_thursday: employee?.works_thursday || data?.works_thursday,
			works_friday: employee?.works_friday || data?.works_friday,
			works_saturday: employee?.works_saturday || data?.works_saturday,
			works_sunday: employee?.works_sunday || data?.works_sunday,

			// if it's edit, it should prefil
			employee_code: employee?.employee_code,
			date_engaged: employee?.date_engaged,
			pension_pin: employee?.pension_pin,
			pension_start_date: employee?.pension_start_date,
			tax_identification_number: employee?.tax_identification_number,
			nhf: employee?.nhf,
			email: employee?.email,
			job_title: employee?.job_title?.id,
			nature_of_contract: employee?.nature_of_contract?.id,
			job_grade: employee?.job_grade?.id,
			bank: employee?.bank?.id,
			account_number: employee?.account_number,
			account_name: employee?.account_name,
			hierarchy: employee?.hierarchy,
			remuneration: employee?.remuneration?.id,
			rates_per_hour: employee?.rates_per_hour
				? parseFloat(employee?.rates_per_hour?.replace(/,/g, ''))
				: 0,
			rates_per_day: employee?.rates_per_day
				? parseFloat(employee?.rates_per_day?.replace(/,/g, ''))
				: 0,
			rates_per_month: employee?.rates_per_month
				? parseFloat(employee?.rates_per_month?.replace(/,/g, ''))
				: 0,
			rates_per_year: employee?.rates_per_year
				? parseFloat(employee?.rates_per_year?.replace(/,/g, ''))
				: 0,
			pension_applied: employee?.pension_applied ? 'active' : 'inactive',
			tax_applied: employee?.tax_applied,
			fixed_tax: employee?.fixed_tax
				? parseFloat(employee?.fixed_tax?.replace(/,/g, ''))
				: 0,
			tax_relief: employee?.tax_relief?.id,
			company_policy: employee?.company_policy,
		};
	};

	const initialValues = {
		title: isEdit ? employee?.title : null,
		first_name: isEdit ? employee?.first_name : null,
		last_name: isEdit ? employee?.last_name : null,
		other_name: isEdit ? employee?.other_name : null,
		personal_email: isEdit ? employee?.personal_email : null,
		gender: isEdit ? employee?.gender : null,
		marital_status: isEdit ? employee?.marital_status : null,
		date_of_birth: isEdit ? employee?.date_of_birth : null,
		nationality: isEdit ? employee?.nationality : null,
		phone_number: isEdit ? employee?.phone_number : null,
		next_of_kin_name: isEdit ? employee?.next_of_kin_name : null,
		next_of_kin_email: isEdit ? employee?.next_of_kin_email : null,
		next_of_kin_phone_number: isEdit
			? employee?.next_of_kin_phone_number
			: null,
		...(queryParams.page === 'employment-info' && {
			...employmentInfoDefaultPolicyValues(),
		}),
		...(queryParams.page === 'policy-info' && {
			company_policy: employee?.company_policy,
		}),
	};

	const stepValues = (values) => {
		const queryParams = getQueryParams();
		if (queryParams.page === 'employee-info') {
			return {
				title: isEdit ? values?.title : null,
				first_name: isEdit ? values?.first_name : null,
				last_name: isEdit ? values?.last_name : null,
				other_name: isEdit ? values?.other_name : null,
				personal_email: isEdit ? values?.personal_email : null,
				gender: isEdit ? values?.gender : null,
				marital_status: isEdit ? values?.marital_status : null,
				date_of_birth: isEdit ? values?.date_of_birth : null,
				nationality: isEdit ? values?.nationality : null,
				phone_number: isEdit ? values?.phone_number : null,
				next_of_kin_name: isEdit ? values?.next_of_kin_name : null,
				next_of_kin_email: isEdit ? values?.next_of_kin_email : null,
				next_of_kin_phone_number: isEdit
					? values?.next_of_kin_phone_number
					: null,
			};
		}
		if (queryParams.page === 'policy-info') {
			return {
				company_policy: values?.company_policy,
			};
		}
		if (queryParams.page === 'employment-info') {
			return {
				employee_code: values.employee_code,
				date_engaged: values.date_engaged,
				probation_period: values.probation_period,
				pension_pin: values.pension_pin,
				pension_start_date: values.pension_start_date,
				tax_identification_number: values.tax_identification_number,
				nhf: values.nhf,
				email: values.email,
				job_title: values.job_title,
				nature_of_contract: values.nature_of_contract,
				job_grade: values.job_grade,
				bank: values.bank,
				account_number: values.account_number,
				account_name: values.account_name,
				hierarchy:
					values.hierarchy &&
					values.hierarchy.map((item) => item.value || item.id),
				remuneration: values.remuneration,
				hours_per_week: values.hours_per_week,
				hours_per_month: values.hours_per_month,
				hours_per_day: values.hours_per_day,
				rates_per_hour: values?.rates_per_hour
					? parseFloat(String(values?.rates_per_hour)?.replace(/,/g, ''))
					: 0,
				rates_per_day: values?.rates_per_day
					? parseFloat(String(values?.rates_per_day)?.replace(/,/g, ''))
					: 0,
				rates_per_month: values?.rates_per_month
					? parseFloat(String(values?.rates_per_month)?.replace(/,/g, ''))
					: 0,
				rates_per_year: values?.rates_per_year
					? parseFloat(String(values?.rates_per_year)?.replace(/,/g, ''))
					: 0,
				pension_applied: values.pension_applied === 'active',
				tax_applied: values.tax_applied,
				fixed_tax: values?.fixed_tax
					? parseFloat(String(values?.fixed_tax)?.replace(/,/g, ''))
					: 0,
				tax_relief: values.tax_relief,
				works_monday: values.works_monday,
				works_tuesday: values.works_tuesday,
				works_wednesday: values.works_wednesday,
				works_thursday: values.works_thursday,
				works_friday: values.works_friday,
				works_saturday: values.works_saturday,
				works_sunday: values.works_sunday,
			};
		}
		if (queryParams.page === 'leave-info') {
			return {
				leaves: values.leaves.map((item) => item.value || item.id),
			};
		}
	};

	const persistCompanyPolicy = (id) => {
		const selectedPolicy = company_policies?.results?.filter(
			(policy) => policy.id === id
		);
		localStorage.setItem('selectedPolicy', JSON.stringify(selectedPolicy[0]));
	};

	const handlePositionClick = (point) => {
		window.location = `/dashboard/employee/edit/${employeeId}?page=${point}`;
	};

	const moveNext = () => {
		if (queryParams.page === 'employee-info') {
			window.location = `/dashboard/employee/edit/${employeeId}?page=policy-info`;
		} else if (queryParams.page === 'policy-info') {
			return `/dashboard/employee/edit/${employeeId}?page=employment-info`;
		} else if (queryParams.page === 'employment-info') {
			return `/dashboard/employee/edit/${employeeId}?page=leave-info`;
		} else if (queryParams.page === 'payslip-info') {
			return `/dashboard/employee/edit/${employeeId}?page=leave-info`;
		}
	};

	const getQueryParamsIndex = {
		'employee-info': 0,
		'policy-info': 1,
		'employment-info': 2,
		'payslip-info': 3,
		'leave-info': 4,
	};

	return (
		<>
			<NavLayout title={`${isEdit ? 'Edit Employee' : 'Add a new Employee'}`} />
			<DashboardSubWrapper className="wrapper-contain">
				<h4 className="page-main-title">Add a new Employee</h4>
				<SectionHeadsnItems className="main-table-wrapper">
					<EmployeeFormStepper
						activeStep={getQueryParamsIndex[queryParams.page]}
						handleStepClick={handlePositionClick}
					/>
					<FormWrapper>
						<FormContent>
							{isLoading ? (
								<Loader loadingText="Fetching Employee info..." />
							) : (
								<div className="row mr-10">
									<div className="col-md-12">
										<Formik
											initialValues={initialValues}
											onSubmit={async (values, resetForm) => {
												if (isEdit && employeeId) {
													await editEmployee(
														employeeId,
														stepValues(values),
														moveNext()
													);
													if (queryParams.page === 'policy-info') {
														persistCompanyPolicy(values.company_policy);
													}
												} else {
													const newEmployeeId = await addEmployee(values);
													if (newEmployeeId) {
														window.location = `/dashboard/employee/edit/${newEmployeeId}?page=policy-info`;
													}
												}
											}}
											validationSchema={
												schemaObj[getQueryParamsIndex[queryParams.page]]
											}
										>
											{(props) => (
												<>
													{queryParams.page === 'employee-info' && (
														<EmployeeInfoForm
															isEdit={isEdit}
															{...props}
															isLoading={isLoading}
														/>
													)}
													{queryParams.page === 'policy-info' && (
														<CompanyPolicyInfoForm
															isEdit={isEdit}
															{...props}
															isLoading={isLoading}
															employee={employee}
														/>
													)}
													{queryParams.page === 'employment-info' && (
														<EmploymentInfoForm
															{...props}
															isLoading={isLoading}
															employee={employee}
															isEdit={isEdit}
														/>
													)}
													{queryParams.page === 'payslip-info' && (
														<PayslipFormDisplay
															moveNext={moveNext}
															employee={employee}
															isEdit={isEdit}
														/>
													)}
													{queryParams.page === 'leave-info' && (
														<LeaveSetupForm
															moveNext={moveNext}
															{...props}
															employee={employee}
															isEdit={isEdit}
														/>
													)}
												</>
											)}
										</Formik>
									</div>
								</div>
							)}
						</FormContent>
					</FormWrapper>
				</SectionHeadsnItems>
			</DashboardSubWrapper>
		</>
	);
};

const SectionHeadsnItems = styled.div`
	margin-top: 2rem;
	background: #ffffff;
	justify-content: center;
	padding: 1rem;
`;

const FormWrapper = styled.div`
	margin-top: 2rem;
`;

const FormContent = styled.div`
	width: 95%;
	margin: 0 auto;
`;

const mapStateToProps = createStructuredSelector({
	isLoading: selectisLoading,
	company_policies: selectAllCompanyPolicy,
	employee: selectEmployee,
});
export default connect(mapStateToProps, {
	addEmployee,
	editEmployee,
	getEmployeeById,
})(AddEmployee);
