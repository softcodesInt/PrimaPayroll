import React from 'react';
import { useMount } from 'broad-state';

import {
	selectAllCompanyPolicy,
	selectisLoadingCompanyPolicy,
} from 'redux/company-policy/selectors';
import { getAllCompanyPolicy } from 'redux/company-policy/actions';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { isEmpty } from 'codewonders-helpers';
import Button from 'components/button';
import Select from 'components/select';
import Loader from 'components/loader';

const CompanyPolicyInfoForm = ({
	values,
	errors,
	touched,
	handleChange,
	handleBlur,
	handleSubmit,

	isLoading,
	isEdit,
	getAllCompanyPolicy,
	company_policies,
	isLoadingPolicies,
}) => {
	useMount(() => {
		if (isEmpty(company_policies)) {
			getAllCompanyPolicy('', 1, '', true);
		}
	});
	return (
		<form onSubmit={handleSubmit}>
			{isLoadingPolicies ? (
				<Loader loadingText="Fetching Company Policies" />
			) : (
				<>
					<div className="row">
						<div className="col-md-6">
							<Select
								hasStrip
								id="company_policy"
								name="company_policy"
								label="Company Policy*"
								value={values.company_policy}
								onChange={handleChange}
								onBlur={handleBlur}
								errorMessage={errors.company_policy}
								isInvalid={errors.company_policy}
							>
								<option>--Choose a company rule--</option>
								{company_policies?.results?.map((policy) => (
									<option key={policy.id} value={policy.id}>
										{policy.name}
									</option>
								))}
							</Select>
						</div>
					</div>
					<Button
						type="submit"
						className="btn-soft mr-auto mt-4"
						isLoading={isLoading}
						disabled={isLoading}
					>
						{isEdit ? 'Save Changes' : 'Submit & Continue'}
					</Button>
				</>
			)}
		</form>
	);
};

const mapStateToProps = createStructuredSelector({
	isLoadingPolicies: selectisLoadingCompanyPolicy,
	company_policies: selectAllCompanyPolicy,
});
export default connect(mapStateToProps, { getAllCompanyPolicy })(
	CompanyPolicyInfoForm
);
