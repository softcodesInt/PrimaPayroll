/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';

/* -------------------------- Internal Dependencies ------------------------- */
import Button from 'components/button';
import Input from 'components/input';
import Modal, { ModalWrap } from 'components/modal';

import { headValidation } from 'utils/validation-schema';
import Radio from 'components/radio';
import TextArea from 'components/textarea';
import { getAllCompanyPolicy } from 'redux/company-policy/actions';
import {
	addRemuneration,
	editRemuneration,
	getAllPayrollCategory,
} from 'redux/payroll/actions';
import { debounce, isEmpty } from 'codewonders-helpers';
import { useMount } from 'broad-state';
import { createStructuredSelector } from 'reselect';
import {
	selectAllCompanyPolicy,
	selectisLoadingCompanyPolicy,
} from 'redux/company-policy/selectors';
import { selectisLoading, selectAllCategories } from 'redux/payroll/selectors';
import { connect } from 'react-redux';

import Select, { MultiSelect } from 'components/select';
/* ---------------------------- AddPayroll PropTypes --------------------------- */
const propTypes = {
	show: PropTypes.bool,
	closeModal: PropTypes.func,
	isLoading: PropTypes.bool,
	isEdit: PropTypes.bool,
	type: PropTypes.string,
};

export const type_map = {
	CONTRIBUTIONS: 'COMPANY_CONTRIBUTION',
	DEDUCTIONS: 'DEDUCTIONS',
	FRINGE_BENEFITS: 'FRINGE_BENEFIT',
	PROVISIONS: 'PROVISIONS',
	ADDITIONS: 'ADDITIONS',
	EARNINGS: 'EARNINGS',
};

const AddPayroll = ({
	show,
	closeModal,
	isLoading,
	isEdit,
	data,
	getAllCompanyPolicy,
	company_policies,
	addRemuneration,
	editRemuneration,
	getAllPayrollCategory,
	payroll_groups,
}) => {
	const state = isEmpty(data)
		? {
				name: '',
				description: '',
				is_active: 'active',
				payroll_groups: '',
				company_policy: '',
		  }
		: {
				...data,
				company_policy: data?.company_policy?.id,
				payroll_groups: data?.payroll_groups,
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
		if (isEmpty(company_policies?.results)) {
			getAllCompanyPolicy('', 1, '', true);
		}
		getAllPayrollCategory();
	});

	const getSelectDropdown = (data) => {
		if (!isEmpty(data?.results)) {
			return data.results.map((value) => {
				return {
					value: value.id,
					label: value.name,
				};
			});
		}
		return [];
	};

	const getSelectDefault = (value, options) => {
		let d;
		let formattedData;
		if (!isEmpty(value)) {
			d = value?.filter((option) => {
				return getSelectDropdown(options)?.filter(
					(data) => data.id === option.value
				);
			});
		}
		if (d) {
			formattedData = d.map((data) => {
				return {
					label: data.name,
					value: data.id,
				};
			});
		}
		return formattedData;
	};

	return (
		<>
			<Modal
				show={show}
				closeModal={closeModal}
				title={
					isEdit && isEdit !== 'view' ? (
						`Edit Remuneration`
					) : isEdit === 'view' ? (
						<>
							View <b>Remuneration</b>
						</>
					) : (
						`Add Remuneration`
					)
				}
				description="Setup remuneration structure for employees."
			>
				<ModalWrap className="row mr-0">
					<div className="col-md-6">
						<Formik
							initialValues={state}
							validationSchema={headValidation}
							onSubmit={async (
								{
									name,
									description,
									is_active,
									payroll_groups,
									company_policy,
								},
								resetForm
							) => {
								const payroll_data = {
									name,
									description,
									company_policy,
									payroll_groups: payroll_groups.map(
										(item) => item.value || item.id
									),
									is_active: is_active === 'active' || false,
								};
								if (!isEdit) {
									try {
										await addRemuneration?.({
											...payroll_data,
											payroll_groups: payroll_groups.map(
												(item) => item.value || item.id
											),
										});
										closeModal();
										resetForm();
									} catch (e) {}
								} else {
									try {
										await editRemuneration?.(data?.id, {
											...payroll_data,
										});
										closeModal();
										resetForm();
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
										<div className="col-md-12">
											<Input
												hasStrip
												id="name"
												name="name"
												type="text"
												label="Name*"
												placeholder="Enter name of Remuneration"
												value={values.name}
												onChange={handleChange}
												disabled={isEdit === 'view'}
												onBlur={handleBlur}
												errorMessage={errors.name}
												isInvalid={errors.name && touched.name}
											/>
										</div>

										<div className="col-md-12">
											<TextArea
												hasStrip
												id="description"
												name="description"
												label="Description"
												placeholder="Enter description"
												value={values.description}
												onChange={handleChange}
												disabled={isEdit === 'view'}
												onBlur={handleBlur}
												errorMessage={errors.description}
												isInvalid={errors.description && touched.description}
											/>
										</div>
										<div className="col-md-6">
											<label className="mb-3">Status*</label>
											<div className="d-flex flex-wrap mb-3">
												<Radio
													name="is_active"
													type="radio"
													checked={values.is_active === 'active'}
													value="active"
													onChange={() => setFieldValue('is_active', 'active')}
													disabled={isEdit === 'view'}
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
													disabled={isEdit === 'view'}
												>
													{' '}
													<p className="radio">Inactive</p>
												</Radio>
											</div>
										</div>
										<div className="col-md-6">
											<MultiSelect
												label="Payroll Groups"
												placeholder="Select payroll groups"
												options={getSelectDropdown(payroll_groups)}
												onChange={(value) => {
													setFieldValue('payroll_groups', value);
													setFieldTouched('payroll_groups', true);
												}}
												value={
													isEdit && !touched.payroll_groups
														? getSelectDefault(
																values?.payroll_groups,
																payroll_groups
														  )
														: values.payroll_groups
												}
												name="payroll_groups"
											/>
										</div>
										<div className="col-md-6">
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
												{company_policies?.results.map((company_policy) => (
													<option value={company_policy.id}>
														{company_policy.name}
													</option>
												))}
											</Select>
										</div>
									</div>

									{isEdit === 'view' ? (
										<Button
											type="button"
											className="btn-soft mr-auto mt-4"
											onClick={closeModal}
										>
											Cancel View
										</Button>
									) : (
										<Button
											type="submit"
											className="btn-soft mr-auto mt-4"
											isLoading={isLoading}
											disabled={isLoading}
										>
											{isEdit ? 'Save Changes' : `Add Remuneration`}
										</Button>
									)}
								</form>
							)}
						</Formik>
					</div>
				</ModalWrap>
			</Modal>
		</>
	);
};

AddPayroll.propTypes = propTypes;

const mapStateToProps = createStructuredSelector({
	isLoadingCompany: selectisLoadingCompanyPolicy,
	company_policies: selectAllCompanyPolicy,
	isLoading: selectisLoading,
	payroll_groups: selectAllCategories,
});
export default connect(mapStateToProps, {
	addRemuneration,
	editRemuneration,
	getAllCompanyPolicy,
	getAllPayrollCategory,
})(AddPayroll);
