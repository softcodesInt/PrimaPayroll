/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React from 'react';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

/* -------------------------- Internal Dependencies ------------------------- */
import { loginValdationSchema } from 'utils/validation-schema';
import Input from 'components/input';
import Button from 'components/button';
import { Link } from 'react-router-dom';
import { signInUser } from 'redux/user/actions';
import SEO from 'components/seo';
import AuthLayout, {
	AuthStylingLayoutChildren,
} from '../../components/layout/auth-layout';
import { selectisLoading } from 'redux/user/selectors';

/* ----------------------------- Login propTypes ---------------------------- */
const propsTypes = {
	isLoading: PropTypes.bool,
	signInUser: PropTypes.func,
};

const Login = ({ signInUser: signIn, isLoading }) => {
	return (
		<AuthLayout>
			<SEO title="Login" />
			<AuthStylingLayoutChildren>
				<h3>Log In</h3>
				<p className="intro__text">Enter your details to assess your account</p>
				<Formik
					initialValues={{
						email: '',
						password: '',
					}}
					validationSchema={loginValdationSchema}
					onSubmit={async ({ email, password }) => {
						await signIn?.({ email, password });
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
							<p className="intro__link-ext">
								<Link to="forgot">Forgot password?</Link>
							</p>
							<Button
								type="submit"
								className="btn-soft ml-auto"
								isLoading={isLoading}
								disabled={isLoading}
							>
								Log in
							</Button>
						</form>
					)}
				</Formik>
			</AuthStylingLayoutChildren>
		</AuthLayout>
	);
};

Login.propTypes = propsTypes;
const mapStateToProps = createStructuredSelector({
	isLoading: selectisLoading,
});
export default connect(mapStateToProps, { signInUser })(Login);
