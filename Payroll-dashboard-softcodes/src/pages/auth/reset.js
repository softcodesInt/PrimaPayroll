/* eslint-disable no-shadow */
import React from 'react';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { resetValdationSchema } from 'utils/validation-schema';
import { useParams } from 'react-router-dom';

import Input from 'components/input';
import Button from 'components/button';
import { resetPassword } from 'redux/user/actions';
import { selectisLoading } from 'redux/user/selectors';
import SEO from 'components/seo';
import AuthLayout, {
	AuthStylingLayoutChildren,
} from '../../components/layout/auth-layout';

const propTypes = {
	isLoading: PropTypes.bool,
	resetPassword: PropTypes.func,
};

const Reset = ({ resetPassword, isLoading }) => {
	const { id: token } = useParams();
	return (
		<AuthLayout>
			<SEO title="Set up a password" />
			<AuthStylingLayoutChildren>
				<h3>Set up a password</h3>
				<p className="intro__text">Enter a password to link it to your email</p>
				<Formik
					initialValues={{ password: '', newPassword: '' }}
					validationSchema={resetValdationSchema}
					onSubmit={async ({ password }) => {
						await resetPassword?.({ password, token });
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
								id="password"
								name="password"
								type="password"
								label="Password"
								placeholder="Password"
								value={values.password}
								onChange={handleChange}
								onBlur={handleBlur}
								errorMessage={errors.password}
								isInvalid={errors.password && touched.password}
							/>
							<Input
								hasStrip
								id="newPassword"
								name="newPassword"
								type="password"
								label="Confirm Password"
								placeholder="Retype Password"
								value={values.newPassword}
								onChange={handleChange}
								onBlur={handleBlur}
								errorMessage={errors.newPassword}
								isInvalid={errors.newPassword && touched.newPassword}
							/>
							<Button
								type="submit"
								className="btn-soft ml-auto"
								isLoading={isLoading}
								disabled={isLoading}
							>
								Create new password
							</Button>
						</form>
					)}
				</Formik>
			</AuthStylingLayoutChildren>
		</AuthLayout>
	);
};

Reset.propTypes = propTypes;

const mapStateToProps = createStructuredSelector({
	isLoading: selectisLoading,
});

export default connect(mapStateToProps, { resetPassword })(Reset);
