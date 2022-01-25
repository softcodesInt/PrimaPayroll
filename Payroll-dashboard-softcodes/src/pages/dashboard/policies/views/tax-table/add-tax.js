import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';

import Button from 'components/button';
import Input, { ErrorText } from 'components/input';
import Modal, { ModalWrap } from 'components/modal';

import { taxValidation } from 'utils/validation-schema';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import {
	addTaxTable,
	editTaxTable,
	getAllCompanyPolicy,
} from 'redux/company-policy/actions';
import {
	selectAllCompanyPolicy,
	selectisLoadingCompanyPolicy,
	selectisLoadingTaxTable,
} from 'redux/company-policy/selectors';
import { debounce, isEmpty } from 'codewonders-helpers';
import { useMount } from 'broad-state';
import Radio from 'components/radio';
import Select from 'components/select';

const propTypes = {
	show: PropTypes.bool,
	closeModal: PropTypes.func,
	isLoading: PropTypes.bool,
	isEdit: PropTypes.bool,
};

const AddTax = ({
	show,
	closeModal,
	isLoading,
	isEdit,
	data,
	getAllCompanyPolicy,
	addTaxTable,
	editTaxTable,
	policies,
}) => {
	const state = isEmpty(data)
		? {
				income_from: '',
				income_to: '',
				tax_rate: '',
				is_active: 'active',
				company_policy: '',
		  }
		: {
				...data,
				company_policy: data?.company_policy?.id,
				is_active: data?.is_active ? 'active' : 'inactive',
		  };

	const previousSearchTermRef = useRef('');
	// eslint-disable-next-line
	const search = debounce(async (value) => {
		if (previousSearchTermRef.current === value) {
			try {
				// await refetch();
			} finally {
				await getAllCompanyPolicy(value);
			}
		}
	}, 500);

	useMount(() => {
		if (isEmpty(policies?.results)) {
			getAllCompanyPolicy();
		}
	});

	return (
		<>
			<Modal
				show={show}
				closeModal={closeModal}
				title={isEdit ? 'Edit Tax' : 'Add Tax'}
			>
				<ModalWrap className="row mr-0">
					<div className="col-md-6">
						<Formik
							initialValues={state}
							validationSchema={taxValidation}
							onSubmit={async (
								{ income_from, income_to, tax_rate, company_policy, is_active },
								resetForm
							) => {
								const tax_data = {
									income_from,
									income_to,
									tax_rate,
									company_policy,
									is_active: is_active === 'active' || false,
								};
								if (!isEdit) {
									try {
										await addTaxTable?.({ ...tax_data });
										closeModal();
										resetForm({});
									} catch (e) {}
								} else {
									try {
										await editTaxTable?.(data?.id, {
											...tax_data,
											company_policy,
										});
										closeModal();
									} catch (e) {}
								}
							}}
						>
							{({
								values,
								errors,
								touched,
								handleChange,
								setFieldTouched,
								setFieldValue,
								handleBlur,
								handleSubmit,
							}) => (
								<form onSubmit={handleSubmit}>
									<div className="row">
										<div className="col-md-6">
											<Input
												hasStrip
												id="income_from"
												name="income_from"
												type="number"
												label="Income from*"
												placeholder="NGN"
												value={values.income_from}
												onChange={handleChange}
												onBlur={handleBlur}
												errorMessage={errors.income_from}
												isInvalid={errors.income_from && touched.income_from}
											/>
										</div>
										<div className="col-md-6">
											<Input
												hasStrip
												id="income_to"
												name="income_to"
												type="number"
												label="Income to"
												placeholder="NGN"
												value={values.income_to}
												onChange={handleChange}
												onBlur={handleBlur}
												errorMessage={errors.income_to}
												isInvalid={errors.income_to && touched.income_to}
											/>
										</div>
										<div className="col-md-6">
											<Input
												hasStrip
												id="tax_rate"
												name="tax_rate"
												type="number"
												label="Set tax rate"
												placeholder="Tax Rate"
												value={values.tax_rate}
												onChange={handleChange}
												onBlur={handleBlur}
												errorMessage={errors.tax_rate}
												isInvalid={errors.tax_rate && touched.tax_rate}
											/>
										</div>
										<div className="col-md-12">
											<label className="mb-3">Status</label>
											<div className="d-flex flex-wrap mb-3">
												<Radio
													name="is_active"
													type="radio"
													checked={values.is_active === 'active'}
													value="active"
													onChange={() => setFieldValue('is_active', 'active')}
												>
													{' '}
													<p className="radio">Active</p>
												</Radio>
												<Radio
													name="is_active"
													type="radio"
													checked={values.is_active === 'inactive'}
													value="inactive"
													onChange={() =>
														setFieldValue('is_active', 'inactive')
													}
												>
													{' '}
													<p className="radio">Inactive</p>
												</Radio>
											</div>
										</div>
										<div className="col-md-12">
											<Select
												hasStrip
												id="company_policy"
												name="company_policy"
												label="Company Policy"
												value={values.company_policy}
												onChange={handleChange}
												onBlur={handleBlur}
												errorMessage={errors.company_policy}
												isInvalid={
													errors.company_policy && touched.company_policy
												}
											>
												<option value="">-Select-</option>
												{policies?.results.map((company_policy) => (
													<option value={company_policy.id}>
														{company_policy.name}
													</option>
												))}
											</Select>

											{errors?.company_policy ? (
												<ErrorText>{errors?.company_policy}</ErrorText>
											) : (
												<></>
											)}
										</div>
									</div>

									<Button
										type="submit"
										className="btn-soft mr-auto mt-4"
										isLoading={isLoading}
										disabled={isLoading}
									>
										{isEdit ? 'Save Changes' : 'Add Tax'}
									</Button>
								</form>
							)}
						</Formik>
					</div>
				</ModalWrap>
			</Modal>
		</>
	);
};

AddTax.propTypes = propTypes;
const mapStateToProps = createStructuredSelector({
	isLoadingCompany: selectisLoadingCompanyPolicy,
	policies: selectAllCompanyPolicy,
	isLoading: selectisLoadingTaxTable,
});
export default connect(mapStateToProps, {
	addTaxTable,
	editTaxTable,
	getAllCompanyPolicy,
})(AddTax);
