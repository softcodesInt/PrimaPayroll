import React from 'react';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { registerValdationSchema } from 'utils/validation-schema';
import Input from 'components/input';
import Button from 'components/button';
import { signUpUser } from 'redux/user/actions';
import SEO from 'components/seo';
import { selectisLoading } from 'redux/user/selectors';
import { useParams } from 'react-router-dom';
import AuthLayout, {
	AuthStylingLayoutChildren,
} from '../../components/layout/auth-layout';

const propsTypes = {
	isLoading: PropTypes.bool,
	signUpUser: PropTypes.func,
};

const Register = ({ signUpUser: signUp, isLoading }) => {
	const { id: company_id } = useParams();
	return (
		<AuthLayout>
			<SEO title="Create your account" />
			<AuthStylingLayoutChildren>
				<h3>Create your account</h3>
				<p className="intro__text">
					Enter your personal details to create your account
				</p>
				<Formik
					initialValues={{
						email: '',
						first_name: '',
						last_name: '',
						password: '',
					}}
					validationSchema={registerValdationSchema}
					onSubmit={async ({ email, password, first_name, last_name }) => {
						await signUp?.({
							email,
							password,
							first_name,
							last_name,
							company_id,
						});
					}}
				>
					{({
						values,
						errors,
						touched,
						handleChange,
						handleBlur,
						handleSubmit,
					}) => (
						<form onSubmit={handleSubmit}>
							<Input
								hasStrip
								id="first_name"
								name="first_name"
								type="text"
								label="First name"
								placeholder="Enter First Name"
								value={values.first_name}
								onChange={handleChange}
								onBlur={handleBlur}
								errorMessage={errors.first_name}
								isInvalid={errors.first_name && touched.first_name}
							/>
							<Input
								hasStrip
								id="last_name"
								name="last_name"
								type="text"
								label="Last name"
								placeholder="Enter Last Name"
								value={values.last_name}
								onChange={handleChange}
								onBlur={handleBlur}
								errorMessage={errors.last_name}
								isInvalid={errors.last_name && touched.first_name}
							/>

							<Input
								hasStrip
								id="email"
								name="email"
								type="email"
								label="Email address"
								placeholder="Enter email address"
								value={values.email}
								onChange={handleChange}
								onBlur={handleBlur}
								errorMessage={errors.email}
								isInvalid={errors.email && touched.email}
							/>

							<Input
								hasStrip
								id="password"
								name="password"
								type="password"
								label="Password"
								placeholder="Enter password"
								value={values.password}
								onChange={handleChange}
								onBlur={handleBlur}
								errorMessage={errors.password}
								isInvalid={errors.password && touched.password}
							/>

							<Button
								type="submit"
								className="btn-soft ml-auto"
								isLoading={isLoading}
								disabled={isLoading}
							>
								Create account
							</Button>
						</form>
					)}
				</Formik>
			</AuthStylingLayoutChildren>
		</AuthLayout>
	);
};

Register.propTypes = propsTypes;
const mapStateToProps = createStructuredSelector({
	isLoading: selectisLoading,
});
export default connect(mapStateToProps, { signUpUser })(Register);
