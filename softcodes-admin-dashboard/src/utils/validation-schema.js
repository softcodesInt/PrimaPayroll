import * as yup from 'yup';

export const loginValdationSchema = yup.object().shape({
	email: yup
		.string()
		.email('Email is invalid')
		.required('Email is required'),
	password: yup.string().required('Password is required'),
});

export const createStaffValdationSchema = yup.object().shape({
	first_name: yup.string().required('First Name is required'),
	last_name: yup.string().required('Last Name is required'),
	role: yup.string().required('Role is required'),
	email: yup
		.string()
		.email('Email is invalid')
		.required('Email is required'),
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
