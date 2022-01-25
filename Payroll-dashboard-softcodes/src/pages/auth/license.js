import React, { useState } from 'react';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import moment from 'moment';

import { licenseCodeValidation } from 'utils/validation-schema';
import Input from 'components/input';
import Button from 'components/button';
import { activateLicense } from 'redux/user/actions';
import SEO from 'components/seo';
import { selectCurrentCompany, selectisLoading } from 'redux/user/selectors';
import styled from 'styled-components';
import {
	clearState,
	getState,
	setState,
} from 'codewonders-helpers/bundle-cjs/helpers/localstorage';
import history from 'utils/history';
import AuthLayout, {
	AuthStylingLayoutChildren,
} from '../../components/layout/auth-layout';

const propsTypes = {
	isLoading: PropTypes.bool,
	activateLicense: PropTypes.func,
	company: PropTypes.shape,
};

const License = ({ activateLicense: activateCode, company, isLoading }) => {
	const [subDetails, setSubDetails] = useState(false);
	return (
		<AuthLayout>
			{!subDetails && !getState('company__activated') ? (
				<>
					{' '}
					<SEO title="License code" />
					<AuthStylingLayoutChildren>
						<h3>Enter License code</h3>
						<p className="intro__text">
							Enter the generated license code to assess this software
						</p>
						<Formik
							initialValues={{
								code: '',
							}}
							validationSchema={licenseCodeValidation}
							onSubmit={async ({ code }) => {
								const newCompany = await activateCode?.({ code });
								setSubDetails(true);
								setState('company__activated', JSON.stringify(newCompany));
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
										id="code"
										name="code"
										type="text"
										label="License code"
										placeholder="Enter License code"
										value={values.code}
										onChange={handleChange}
										onBlur={handleBlur}
										errorMessage={errors.code}
										isInvalid={errors.code && touched.code}
									/>

									<Button
										type="submit"
										className="btn-soft ml-auto"
										isLoading={isLoading}
										disabled={isLoading}
									>
										Next
									</Button>
								</form>
							)}
						</Formik>
					</AuthStylingLayoutChildren>
				</>
			) : (
				<>
					{' '}
					<SEO title={`Welcome ${company?.name}`} />
					<AuthStylingLayoutChildren>
						<h3>Welcome, {company?.name}!</h3>
						<p className="intro__text">Here are your subscription details</p>
						<Subscription>
							<p className="subscription__details-info">
								{company?.bought_payroll && 'PAYROLL'}{' '}
								{company?.bought_ess && company?.bought_payroll ? 'and' : ''}{' '}
								{company?.bought_ess && 'ESS'}{' '}
								{!company?.bought_ess || !company?.bought_payroll ? 'only' : ''}
							</p>

							<h2>
								{company?.employee_count} <small>employees</small>
							</h2>

							<p className="subscription__details-date">
								Expires on{' '}
								{moment(company?.date_expired).format('MMMM Do YYYY')}
							</p>
						</Subscription>
						<Button
							type="button"
							className="btn-soft ml-auto"
							onClick={async () => {
								await clearState('company__activated');
								history.push(`/register/${company?.company_id}`);
							}}
						>
							Proceed
						</Button>
					</AuthStylingLayoutChildren>
				</>
			)}
		</AuthLayout>
	);
};
const Subscription = styled.div`
	padding: 1rem 1.3rem;

	margin-top: 6rem;

	background: #ffffff;
	border: 1px solid rgba(0, 0, 0, 0.15);
	box-sizing: border-box;
	box-shadow: 2px 4px 15px -3px rgba(141, 153, 163, 0.15);
	border-radius: 8px;
	p {
		margin: 0;
	}
	.subscription__details-info {
		background: var(--text-black);
		border-radius: 2px;
		padding: 6px 15px;
		width: fit-content;
		font-style: normal;
		font-weight: 500;
		font-size: var(--font-p);
		line-height: 18px;
		letter-spacing: 0.02em;

		color: #ffffff;
	}
	h2 {
		font-style: normal;
		font-weight: bold;
		line-height: 1.2;
		font-size: var(--font-h2);
		margin: 1.3rem 0;
		/* identical to box height */

		letter-spacing: -0.03em;

		/* Text/Black */

		color: #141515;
		small {
			font-size: 19px;
			color: var(--text-gray);
			font-weight: 500;
		}
	}
	.subscription__details-date {
		font-style: normal;
		font-weight: normal;
		font-size: var(--font-p);
		line-height: 18px;
		letter-spacing: 0.02em;

		/* Text/Grey */

		color: var(--text-gray);
	}
`;
License.propTypes = propsTypes;
const mapStateToProps = createStructuredSelector({
	isLoading: selectisLoading,
	company: selectCurrentCompany,
});
export default connect(mapStateToProps, { activateLicense })(License);
