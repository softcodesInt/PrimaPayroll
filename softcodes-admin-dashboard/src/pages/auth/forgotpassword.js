/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React from 'react';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router-dom';

/* -------------------------- Internal Dependencies ------------------------- */
import { forgotPassword } from 'redux/user/actions';
import { selectisLoading } from 'redux/user/selectors';
import { forgotValdationSchema } from 'utils/validation-schema';
import Input from 'components/input';
import Button from 'components/button';
import SEO from 'components/seo';
import AuthLayout, {
	AuthStylingLayoutChildren,
} from '../../components/layout/auth-layout';

/* ---------------------------- Forgot propTypes ---------------------------- */
const propTypes = {
	isLoading: PropTypes.bool,
	forgotPassword: PropTypes.func,
};

const Forgot = ({ forgotPassword: forgot, isLoading }) => {
	return (
		<AuthLayout>
			<SEO title="Forgot password" />
			<AuthStylingLayoutChildren>
				<h3>Forgot password</h3>
				<p className="intro__text">
					Enter your email address and a link will be sent to you
				</p>
				<Formik
					initialValues={{
						email: '',
					}}
					validationSchema={forgotValdationSchema}
					onSubmit={async ({ email }) => {
						await forgot?.({ email });
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
								label="Email Address"
								placeholder="Email Address"
								value={values.email}
								onChange={handleChange}
								onBlur={handleBlur}
								errorMessage={errors.email}
								isInvalid={errors.email && touched.email}
							/>
							<p className="intro__link-ext">
								<Link to="/"> Remmember ?</Link>
							</p>
							<Button
								type="submit"
								className="btn-soft ml-auto"
								isLoading={isLoading}
								disabled={isLoading}
							>
								Retrieve password
							</Button>
						</form>
					)}
				</Formik>
			</AuthStylingLayoutChildren>
		</AuthLayout>
	);
};

Forgot.propTypes = propTypes;

const mapStateToProps = createStructuredSelector({
	isLoading: selectisLoading,
});

export default connect(mapStateToProps, { forgotPassword })(Forgot);
