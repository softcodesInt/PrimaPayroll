/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React, { useRef, useState } from 'react';
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
	addPayroll,
	editPayroll,
	getAllPayrollCategory,
} from 'redux/payroll/actions';
import { debounce, isEmpty } from 'codewonders-helpers';
import { useMount } from 'broad-state';
import AutoCompleteInput from 'components/autocomplete-input';
import { createStructuredSelector } from 'reselect';
import {
	selectAllCompanyPolicy,
	selectisLoadingCompanyPolicy,
} from 'redux/company-policy/selectors';
import { selectisLoading } from 'redux/payroll/selectors';
import { connect } from 'react-redux';
import { ReactComponent as Loading } from 'assets/icons/loading.svg';
import { capitalize } from 'utils';
import Select from 'components/select';
import { getAllSubsidiary } from 'redux/subsidiary/actions';
import { selectAllSubsidiaries } from 'redux/subsidiary/selectors';
import { selectAllCategories } from 'redux/leave/selectors';
import AddPayrollCategory from '../payroll-categories/add-payroll-category';

/* ---------------------------- AddPayroll PropTypes --------------------------- */
const propTypes = {
	show: PropTypes.bool,
	closeModal: PropTypes.func,
	isLoading: PropTypes.bool,
	isEdit: PropTypes.bool,
	type: PropTypes.string,
};

const AddPayroll = ({
	show,
	closeModal,
	isLoading,
	isEdit,
	data,
	isLoadingCompany,
	getAllCompanyPolicy,
	company_policies,
	addPayroll,
	editPayroll,
	getAllSubsidiary,
	subsidiaries,
	getAllPayrollCategory,
	categories,
}) => {
	const state = isEmpty(data)
		? {
				name: '',
				description: '',
				is_active: 'active',
				mandatory: 'yes',
				prorata: 'yes',
				calculation_type: '',
				earning_type: '',
				when_to_pay: '',
				prorata_value: '',
				calculation_type_value: '',
				element_type: 'EARNINGS',
				category: '',
				company: '',
				company_policy: '',
		  }
		: {
				...data,
				category: `${data?.category?.name},${data?.category?.id}`,
				company_policy: `${data?.company_policy?.name},${data?.company_policy?.id}`,
				company: `${data?.company?.name},${data?.company?.id}`,
				is_active: data?.is_active ? 'active' : 'inactive',
				mandatory: data?.mandatory ? 'yes' : 'no',
				prorata: data?.prorata ? 'yes' : 'no',
		  };

	const [searchTerm, setSearchTerm] = useState('');
	const [searchCompanyTerm, setSearchCompanyTerm] = useState('');
	const [searchCategoryTerm, setSearchCategoryTerm] = useState('');
	const [showModal, setShow] = useState(false);

	const previousSearchTermRef = useRef('');
	const previousSearchCompanyTermRef = useRef('');
	const previousSearchCategoryRef = useRef('');

	const search = debounce(async (value) => {
		if (previousSearchTermRef.current === value) {
			try {
				// await refetch();
			} finally {
				await getAllCompanyPolicy(value);
			}
		}
	}, 500);
	const searchCompany = debounce(async (value) => {
		if (previousSearchCompanyTermRef.current === value) {
			try {
				// await refetch();
			} finally {
				await getAllSubsidiary(value);
			}
		}
	}, 500);

	const searchCategory = debounce(async (value) => {
		if (previousSearchCategoryRef.current === value) {
			try {
				// await refetch();
			} finally {
				await getAllPayrollCategory(value);
			}
		}
	}, 500);

	useMount(() => {
		if (isEmpty(company_policies.results)) {
			getAllCompanyPolicy('', 1, '', true);
		}
		if (isEmpty(subsidiaries.results)) {
			getAllSubsidiary('', 1, '', true);
		}
		if (isEmpty(categories)) {
			getAllPayrollCategory();
		}
	});

	return (
		<>
			<Modal
				show={show}
				closeModal={closeModal}
				title={
					isEdit && isEdit !== 'view' ? (
						`Edit Earnings`
					) : isEdit === 'view' ? (
						<>
							View <b>{capitalize(data?.name)}</b>
						</>
					) : (
						`Add Earnings`
					)
				}
			>
				<ModalWrap className="row mr-0">
					<div className="col-md-9">
						<Formik
							initialValues={state}
							validationSchema={headValidation}
							onSubmit={async (
								{
									name,
									description,
									is_active,
									mandatory,
									prorata,
									calculation_type,
									earning_type,
									when_to_pay,
									element_type,
									prorata_value,
									category,
									company,
									calculation_type_value,
									company_policy,
								},
								resetForm
							) => {
								const payroll_data = {
									name,
									description,
									calculation_type,
									earning_type,
									when_to_pay,
									element_type,
									prorata_value,
									calculation_type_value:
										calculation_type !== 'NONE' ? calculation_type_value : 0,
									company: company?.split(',')[1],
									category: category?.split(',')[1],
									company_policy: company_policy?.split(',')[1],
									mandatory: mandatory === 'yes' || false,
									prorata: prorata === 'yes' || false,
									is_active: is_active === 'active' || false,
								};
								if (!isEdit) {
									try {
										await addPayroll?.({ ...payroll_data });
										closeModal();
										setSearchCompanyTerm();
										setSearchTerm();
										setSearchCategoryTerm();
										resetForm();
									} catch (e) {}
								} else {
									try {
										await editPayroll?.(data?.id, {
											...payroll_data,
										});
										closeModal();
										setSearchCompanyTerm();
										setSearchTerm();
										setSearchCategoryTerm();
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
												placeholder={`Enter name of earnings`}
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
											<div className="row">
												<div className="col-md">
													<Select
														hasStrip
														id="calculation_type"
														name="calculation_type"
														label="Calculation*"
														value={values.calculation_type}
														onChange={handleChange}
														disabled={isEdit === 'view'}
														onBlur={handleBlur}
														errorMessage={errors.calculation_type}
														isInvalid={
															errors.calculation_type &&
															touched.calculation_type
														}
													>
														<option>--Choose a calculation type--</option>
														<option value="PERCENTAGE">Percentage</option>
														<option value="FIXED">Fixed</option>
														<option value="NONE">None</option>
													</Select>
												</div>
												{values?.calculation_type &&
												values?.calculation_type !== 'NONE' ? (
													<div className="col-md-7">
														<Input
															hasStrip
															id="calculation_type_value"
															name="calculation_type_value"
															type="number"
															label="Amount*"
															placeholder={`Amount`}
															value={values.calculation_type_value}
															onChange={handleChange}
															disabled={isEdit === 'view'}
															onBlur={handleBlur}
															errorMessage={errors.calculation_type_value}
															isInvalid={
																errors.calculation_type_value &&
																touched.calculation_type_value
															}
														/>
													</div>
												) : null}
											</div>
										</div>
										<div className="col-md-6">
											<label className="mb-3">Is it Mandatory?*</label>
											<div className="d-flex flex-wrap mb-3">
												<Radio
													name="mandatory"
													type="radio"
													checked={values.mandatory === 'yes'}
													value="yes"
													onChange={() => setFieldValue('mandatory', 'yes')}
													disabled={isEdit === 'view'}
												>
													{' '}
													<p className="radio">Yes</p>
												</Radio>
												<Radio
													name="mandatory"
													type="radio"
													checked={values.mandatory === 'no'}
													value="no"
													onChange={() => setFieldValue('mandatory', 'no')}
													disabled={isEdit === 'view'}
												>
													{' '}
													<p className="radio">No</p>
												</Radio>
											</div>
										</div>
										<div className="col-md-6">
											<AutoCompleteInput
												hasStrip
												id="company"
												name="company"
												type="text"
												label="Company*"
												disabled={isEdit === 'view'}
												placeholder="Search and Select Company Rule to add"
												value={
													searchCompanyTerm || state.company?.split(',')[0]
												}
												onChange={(e) => {
													setSearchCompanyTerm(e.target.value);
													previousSearchCompanyTermRef.current = e.target.value;
													searchCompany(e.target.value);
												}}
												activeClassName={
													searchCompanyTerm &&
													searchCompanyTerm === values?.company?.split(',')[0]
												}
												onBlur={handleBlur}
												errorMessage={errors.company}
												isInvalid={errors.company && touched.company}
											>
												{' '}
												{!isLoadingCompany ? (
													<>
														{!isEmpty(subsidiaries?.results) ? (
															<>
																{subsidiaries?.results?.map((company_data) => (
																	<button
																		onClick={(e) => {
																			e.preventDefault();
																			setSearchCompanyTerm(
																				`${company_data?.name}`
																			);
																			setFieldValue(
																				'company',
																				`${company_data?.name},${company_data?.company}`
																			);
																		}}
																		className="button"
																	>
																		<p>{company_data?.name}</p>
																	</button>
																))}
															</>
														) : (
															<p className="mx-2 text-center">
																No companies found
															</p>
														)}
													</>
												) : (
													<Loading />
												)}
											</AutoCompleteInput>
										</div>
										<div className="col-md-6">
											<label className="mb-3">
												Is it Pro rata? (should this earnings be prorated, if
												set to yes, it uses the date_engaged for the first
												salary and termination date for the flast payment)*
											</label>
											<div className="d-flex flex-wrap mb-3">
												<Radio
													name="prorata"
													type="radio"
													checked={values.prorata === 'yes'}
													value="yes"
													onChange={() => setFieldValue('prorata', 'yes')}
													disabled={isEdit === 'view'}
												>
													{' '}
													<p className="radio">Yes</p>
												</Radio>
												<Radio
													name="prorata"
													type="radio"
													checked={values.prorata === 'no'}
													value="no"
													onChange={() => setFieldValue('prorata', 'no')}
													disabled={isEdit === 'view'}
												>
													{' '}
													<p className="radio">No</p>
												</Radio>
											</div>
										</div>
										{console.log('values', values)}
										{values.prorata === 'yes' && (
											<div className="col-md-6">
												<Select
													hasStrip
													id="prorata_value"
													name="prorata_value"
													label="Pro rata Day*"
													value={values.prorata_value}
													onChange={handleChange}
													disabled={isEdit === 'view'}
													onBlur={handleBlur}
													errorMessage={errors.prorata_value}
													isInvalid={
														errors.prorata_value && touched.prorata_value
													}
												>
													<option>--Click to select a prorata day--</option>
													<option value="CALENDAR WORKDAYS">
														Calendar Workdays
													</option>
													<option value="CUSTOM">Custom</option>
												</Select>
											</div>
										)}

										<div className="col-md-6">
											<AutoCompleteInput
												hasStrip
												id="category"
												name="category"
												type="text"
												label="Category*"
												placeholder="Search and Select Category to add"
												disabled={isEdit === 'view'}
												value={
													searchCategoryTerm || state.category?.split(',')[0]
												}
												onChange={(e) => {
													setSearchCategoryTerm(e.target.value);
													previousSearchCategoryRef.current = e.target.value;
													searchCategory(e.target.value);
												}}
												activeClassName={
													searchCategoryTerm &&
													searchCategoryTerm === values?.category?.split(',')[0]
												}
												onBlur={handleBlur}
												errorMessage={errors.category}
												isInvalid={errors.category && touched.category}
											>
												{' '}
												{!isLoadingCompany ? (
													<>
														{!isEmpty(categories?.results) ? (
															<>
																<button
																	onClick={() => setShow(true)}
																	className="btn btn-light-blue btn-block"
																>
																	Add New Category
																</button>
																{categories?.results?.map((category_data) => (
																	<button
																		onClick={(e) => {
																			e.preventDefault();
																			setSearchCategoryTerm(
																				`${category_data?.name}`
																			);
																			setFieldValue(
																				'category',
																				`${category_data?.name},${category_data?.id}`
																			);
																		}}
																		className="button"
																	>
																		<p>{category_data?.name}</p>
																	</button>
																))}
															</>
														) : (
															<p className="mx-2 text-center">
																No categories found
															</p>
														)}
													</>
												) : (
													<Loading />
												)}
											</AutoCompleteInput>
										</div>

										<div className="col-md-6">
											<Select
												hasStrip
												id="earning_type"
												name="earning_type"
												label="Earning Type*"
												value={values.earning_type}
												onChange={handleChange}
												disabled={isEdit === 'view'}
												onBlur={handleBlur}
												errorMessage={errors.earning_type}
												isInvalid={errors.earning_type && touched.earning_type}
											>
												<option>--Click to select an earning type --</option>
												<option value="PENSIONABLE">Pensionable</option>
												<option value="TAXABLE">Taxable</option>
												<option value="NON_TAXABLE">Non Taxable</option>
											</Select>
										</div>
										<div className="col-md-6">
											<Select
												hasStrip
												id="when_to_pay"
												name="when_to_pay"
												label="When to pay*"
												value={values.when_to_pay}
												onChange={handleChange}
												disabled={isEdit === 'view'}
												onBlur={handleBlur}
												errorMessage={errors.when_to_pay}
												isInvalid={errors.when_to_pay && touched.when_to_pay}
											>
												<option>--Click to select an earning type --</option>
												<option value="BIRTHDAY">Birthday</option>
												<option value="ALWAYS">Always</option>
												<option value="DATE_ENGAGED">Date Engaged</option>
												<option value="CUSTOM_MONTH">Custom Month</option>
											</Select>
										</div>
										<div className="col-md-6">
											<AutoCompleteInput
												hasStrip
												id="company_policy"
												name="company_policy"
												type="text"
												label="Company Rule*"
												placeholder="Search and Select Company Rule to add"
												disabled={isEdit === 'view'}
												value={
													searchTerm || state.company_policy?.split(',')[0]
												}
												onChange={(e) => {
													setSearchTerm(e.target.value);
													previousSearchTermRef.current = e.target.value;
													search(e.target.value);
												}}
												activeClassName={
													searchTerm &&
													searchTerm === values?.company_policy?.split(',')[0]
												}
												onBlur={handleBlur}
												errorMessage={errors.company_policy}
												isInvalid={
													errors.company_policy && touched.company_policy
												}
											>
												{' '}
												{!isLoadingCompany ? (
													<>
														{!isEmpty(company_policies?.results) ? (
															<>
																{company_policies?.results?.map(
																	(company_policy_data) => (
																		<button
																			onClick={(e) => {
																				e.preventDefault();
																				setSearchTerm(
																					`${company_policy_data?.name}`
																				);
																				setFieldValue(
																					'company_policy',
																					`${company_policy_data?.name},${company_policy_data?.id}`
																				);
																			}}
																			className="button"
																		>
																			<p>{company_policy_data?.name}</p>
																		</button>
																	)
																)}
															</>
														) : (
															<p className="mx-2 text-center">
																No companies rule found
															</p>
														)}
													</>
												) : (
													<Loading />
												)}
											</AutoCompleteInput>
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
											{isEdit ? 'Save Changes' : `Add Earnings`}
										</Button>
									)}
								</form>
							)}
						</Formik>
					</div>
				</ModalWrap>
			</Modal>
			<AddPayrollCategory show={showModal} closeModal={() => setShow(false)} />
		</>
	);
};

AddPayroll.propTypes = propTypes;

const mapStateToProps = createStructuredSelector({
	isLoadingCompany: selectisLoadingCompanyPolicy,
	company_policies: selectAllCompanyPolicy,
	isLoading: selectisLoading,
	subsidiaries: selectAllSubsidiaries,
	categories: selectAllCategories,
});
export default connect(mapStateToProps, {
	addPayroll,
	editPayroll,
	getAllCompanyPolicy,
	getAllSubsidiary,
	getAllPayrollCategory,
})(AddPayroll);
