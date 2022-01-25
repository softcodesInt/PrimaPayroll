import * as yup from 'yup';

export const licenseCodeValidation = yup.object().shape({
	code: yup.string().required('License Code is required'),
});
export const loginValdationSchema = yup.object().shape({
	email: yup
		.string()
		.email('Email is invalid')
		.required('Email is required'),
	password: yup
		.string()
		.min(6, 'Password is too short - should be 6 chars minimum.')
		.required('Password is required'),
});
export const registerValdationSchema = yup.object().shape({
	first_name: yup.string().required('First Name is required'),
	last_name: yup.string().required('Last Name is required'),
	email: yup
		.string()
		.email('Email is invalid')
		.required('Email is required'),
	password: yup
		.string()
		.min(6, 'Password is too short - should be 6 chars minimum.')
		.required('Password is required'),
});

export const createStaffValdationSchema = yup.object().shape({
	first_name: yup.string().required('First Name is required'),
	last_name: yup.string().required('Last Name is required'),
	email: yup
		.string()
		.email('Email is invalid')
		.required('Email is required'),
});
export const headValidation = yup.object().shape({
	name: yup.string().required('Name is required'),
});

export const subsidiaryValidation = yup.object().shape({
	name: yup.string().required('Name is required'),
	address: yup.string().required('Address is required'),
	admin: yup.string().required('Admin is required'),
});

export const payrollCategoryValidation = yup.object().shape({
	name: yup.string().required('Name is required'),
	company_policy: yup.string().required('Company Policy is required'),
});

export const createLeaveCategoryValidation = yup.object().shape({
	name: yup.string().required('Name is required'),
	company_policy: yup.string().required('Company Policy is required'),
});

export const addPolicyValidation = yup.object().shape({
	name: yup.string().required('Name is required'),
	payment_cycle: yup.string().required('Please select a payment cycle'),
	is_active: yup.string().required("Please select the Policy's status"),
	statutory_tax_year_start: yup.date().required('Valid year is reequired'),
	statutory_tax_year_end: yup.date().required('Valid year is reequired'),
	probation_months: yup
		.number()
		.min(0)
		.max(12)
		.required('Valid month is required'),
	hours_per_week: yup.number().required('Hours per week is required'),
	hours_per_day: yup.number().required('Hours per day is required'),
	hours_per_month: yup.number().required('Hours per day is required'),
	company: yup
		.array()
		.min(1)
		.required('Please select at least one company'),
});

export const employeeInfoValidation = yup.object().shape({
	first_name: yup
		.string()
		.required('First Name is required')
		.nullable(),
	last_name: yup
		.string()
		.required('Last name is required')
		.nullable(),
	marital_status: yup
		.string()
		.required('Marital status is required')
		.nullable(),
	gender: yup
		.string()
		.required('Gender is required')
		.nullable(),
	date_of_birth: yup
		.date()
		.required('Date of birth is required')
		.nullable(),
	nationality: yup
		.string()
		.required("Please select employee's nationality")
		.nullable(),
	phone_number: yup
		.string()
		.required("Please enter employee's phone number")
		.nullable(),
});

export const companyPolicyValidation = yup.object().shape({
	company_policy: yup
		.string()
		.required('Please choose a company policy')
		.nullable(),
});

export const employmentInfoValidation = yup.object().shape({
	employee_code: yup
		.string()
		.required('Employeee code is required')
		.nullable(),
	date_engaged: yup
		.date()
		.required('Please enter a valid date')
		.nullable(),
	probation_period: yup
		.string()
		.required('Probation period is required')
		.nullable(),
	// email: yup
	// 	.string()
	// 	.required('Email is required')
	// 	.nullable(),
	job_title: yup
		.string()
		.required('Job title is required')
		.nullable(),
	nature_of_contract: yup
		.string()
		.required('Nature of contract is required')
		.nullable(),
	// job_grade: yup
	// 	.string()
	// 	.required('Job grade is required')
	// 	.nullable(),
	bank: yup
		.string()
		.required('Bank is required')
		.nullable(),
	account_number: yup
		.string()
		.required('Account Number is required')
		.nullable(),
	account_name: yup
		.string()
		.required('Account name is required')
		.nullable(),
	hierarchy: yup
		.array()
		.min(1)
		.required('Hierarchy is requireed'),
	remuneration: yup
		.string()
		.required('Please select a valid renumeration structure')
		.nullable(),
	hours_per_day: yup
		.number()
		.required('Hours per day is required')
		.nullable(),
	hours_per_week: yup
		.number()
		.required('Hours per week is required')
		.nullable(),
	hours_per_month: yup
		.number()
		.required('Hours per month is required')
		.nullable(),
	rates_per_hour: yup
		.string()
		.required('Rates per hour is required')
		.nullable(),
	rates_per_day: yup
		.string()
		.required('Rates per day is required')
		.nullable(),
	rates_per_month: yup
		.string()
		.required('Rates per month is required')
		.nullable(),
	rates_per_year: yup
		.string()
		.required('Rates per year is required')
		.nullable(),
	pension_applied: yup
		.string()
		.required('Pension applied is required')
		.nullable(),
	tax_applied: yup
		.string()
		.required('Tax applied is required')
		.nullable(),
});

export const taxValidation = yup.object().shape({
	income_from: yup
		.number()
		.min(0)
		.required('Income From is required'),
	income_to: yup
		.number()
		.min(1)
		.required('Income To is required'),
	tax_rate: yup
		.number()
		.min(1)
		.required('Tax rate is required'),
	company_policy: yup.string().required('Company policy must be selected'),
});

export const addHolidayValidation = yup.object().shape({
	name: yup.string().required('Name is required'),
	date_from: yup.date().required('Date is required'),
	company_policy: yup
		.array()
		.min(1)
		.required('At least one Company policy must be selected'),
});

export const addPayrollValidation = yup.object().shape({
	name: yup.string().required('Name is required'),
	calculation_type: yup.string().required('Please select a calculation type'),
	calculation_type_value: yup
		.string()
		.required('Amount/Custom query is required'),
	company_policy: yup
		.array()
		.min(1)
		.required('At least one Company Policy must be selected'),
	// when_to_pay: yup.string().required('When to pay is required'),
	earning_type: yup.string().required('Earning type is required'),

	company: yup.string().required('Company is required'),
	category: yup.string().required('Payroll group is required'),
});

export const addPayrollCustomValidation = yup.object().shape({
	name: yup.string().required('Name is required'),
	calculation_type: yup.string().required('Please select a calculation type'),
	calculation_type_value: yup
		.string()
		.required('Amount/Custom query is required'),
	company_policy: yup
		.array()
		.min(1)
		.required('At least one Company Policy must be selected'),
	// when_to_pay: yup.string().required('Required'),
	// earning_type: yup.string().required('Earning type is required'),

	company: yup.string().required('Company is required'),
	category: yup.string().required('Payroll group is required'),

	// when_to_pay_months: yup
	// 	.array()
	// 	.min(1)
	// 	.required('When to pay is required'),
});

export const leaveCtaegoryValidation = yup.object().shape({
	leave_category: yup.string().required('Leave category is required'),
	leaves: yup
		.array()
		.min(1)
		.required('Please select atleast one applicable leave'),
});

export const leaveValidation = yup.object().shape({
	name: yup.string().required('Name is required'),
	category: yup.string().required('Category is required'),
	entitlement_value: yup.string().required('Entitlement is required'),
	months_prior: yup.number().required('Please add minimum months required'),
});
export const itemValidation = yup.object().shape({
	name: yup.string().required('Name is required'),
	parent: yup.string().required('Head is required'),
});

export const createCompanyValdationSchema = yup.object().shape({
	name: yup.string().required('Company Name is required'),
	phone_number: yup.string().required('Company Phone Number is required'),
	email: yup
		.string()
		.email('Email is invalid')
		.required('Email is required'),
	address: yup.string().required('Company Address is Required'),
	blame: yup.string().required('Please Assing To a staff'),
	subscription_year: yup.number().required('Subscription Year is required'),
	subscription_month: yup.number().required('Subscription Month is required'),
	employee_count: yup
		.number()
		.min(1)
		.required('Staff Count is required'),
});

export const forgotValdationSchema = yup.object().shape({
	email: yup
		.string()
		.email('Email is invalid')
		.required('Email is required'),
});

export const resetValdationSchema = yup.object().shape({
	password: yup
		.string()
		.min(6, 'Password is too short - should be 6 chars minimum.')
		.required('Password is required'),
	newPassword: yup
		.string()
		.required('Password confirmation is required')
		.oneOf([yup.ref('password'), null], 'Passwords must match'),
});

export const leaveWorkflowSchema = yup.object().shape({
	employee: yup.string().required('Employee is required'),
	leave: yup.string().required('Leave is required'),
	start_date: yup.string().required('Start Date is required'),
	number_of_days: yup.number().required('Number of days is required'),
});

export const essLeaveWorkflowSchema = yup.object().shape({
	leave: yup.string().required('Leave is required'),
	start_date: yup.string().required('Start Date is required'),
	number_of_days: yup.number().required('Number of days is required'),
});
