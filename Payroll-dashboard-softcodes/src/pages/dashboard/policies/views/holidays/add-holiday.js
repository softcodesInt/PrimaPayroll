/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';

/* -------------------------- Internal Dependencies ------------------------- */
import Button from 'components/button';
import Input, { ErrorText } from 'components/input';
import Modal, { ModalWrap } from 'components/modal';

import { addHolidayValidation } from 'utils/validation-schema';
import Radio from 'components/radio';
import TextArea from 'components/textarea';
import CheckBox from 'components/checkbox';
import {
	addHoliday,
	editHoliday,
	getAllCompanyPolicy,
} from 'redux/company-policy/actions';
import { debounce, isEmpty } from 'codewonders-helpers';
import { useMount } from 'broad-state';
import { createStructuredSelector } from 'reselect';
import {
	selectAllCompanyPolicy,
	selectisLoadingCompanyPolicy,
	selectisLoadingHoliday,
} from 'redux/company-policy/selectors';
import { connect } from 'react-redux';
import { MultiSelect } from 'components/select';
/* ---------------------------- AddHoliday PropTypes --------------------------- */
const propTypes = {
	show: PropTypes.bool,
	closeModal: PropTypes.func,
	isLoading: PropTypes.bool,
	isEdit: PropTypes.bool,
};

const AddHoliday = ({
	show,
	closeModal,
	isLoading,
	isEdit,
	data,
	getAllCompanyPolicy,
	company_policies,
	addHoliday,
	editHoliday,
}) => {
	const state = isEmpty(data)
		? {
				name: '',
				description: '',
				date_from: '',
				recurring: 'yes',
				company_policy: '',
		  }
		: {
				...data,
				company_policy: data?.company_policy,
				recurring: data?.recurring ? 'yes' : 'no',
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
		if (isEmpty(company_policies)) {
			getAllCompanyPolicy('', 1, '', true);
		}
	});

	const getCompnayPoliciesOptions = () => {
		if (!isEmpty(company_policies?.results)) {
			return company_policies.results.map((data) => {
				return {
					value: data.id,
					label: data.name,
				};
			});
		}
		return [];
	};

	const getDefaultComapnies = (value) => {
		let d;
		let formattedData;
		if (!isEmpty(value)) {
			d = value?.filter((option) => {
				return getCompnayPoliciesOptions()?.filter(
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

	const [multiDate, setMultiDate] = useState(state.date_to ? true : false);

	return (
		<>
			<Modal
				show={show}
				closeModal={closeModal}
				title={isEdit ? 'Edit Holiday' : 'Add Holiday'}
			>
				<ModalWrap className="row mr-0">
					<div className="col-md-6">
						<Formik
							initialValues={state}
							validationSchema={addHolidayValidation}
							onSubmit={async (
								{
									name,
									description,

									date_from,
									date_to,

									company_policy,
									recurring,
								},
								resetForm
							) => {
								const holiday_data = {
									name,
									description,

									date_from,
									date_to,

									company_policy: company_policy.map(
										(item) => item.value || item.id
									),
									recurring: recurring === 'yes' || false,
								};
								if (!isEdit) {
									try {
										await addHoliday?.({
											...holiday_data,
											company_policy: company_policy.map(
												(item) => item.value || item.id
											),
										});
										closeModal();
										resetForm({});
									} catch (e) {}
								} else {
									try {
										await editHoliday?.(data?.id, {
											...holiday_data,
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
										<div className="col-md-12">
											<Input
												hasStrip
												id="name"
												name="name"
												type="text"
												label="Name*"
												placeholder="Enter name of holiday"
												value={values.name}
												onChange={handleChange}
												onBlur={handleBlur}
												errorMessage={errors.name}
												isInvalid={errors.name && touched.name}
											/>
										</div>

										<div className="col-md-12">
											<CheckBox
												name="multi_date"
												checked={multiDate}
												value={!multiDate}
												onChange={() => setMultiDate(!multiDate)}
											>
												{' '}
												<p className="radio">More than a day?</p>
											</CheckBox>
										</div>

										<div className="col-md-6">
											<Input
												hasStrip
												id="date_from"
												name="date_from"
												type="date"
												format="yyyy-mm-dd"
												label="From*"
												placeholder="yyyy-mm-dd"
												value={values.date_from}
												onChange={handleChange}
												onBlur={handleBlur}
												errorMessage={errors.date_from}
												isInvalid={errors.date_from && touched.date_from}
											/>
										</div>
										{multiDate ? (
											<div className="col-md-6">
												<Input
													hasStrip
													id="date_to"
													name="date_to"
													type="date"
													format="yyyy-mm-dd"
													label="To"
													placeholder="yyyy-mm-dd"
													value={values.date_to}
													onChange={handleChange}
													onBlur={handleBlur}
													errorMessage={errors.date_to}
													isInvalid={errors.date_to && touched.date_to}
												/>
											</div>
										) : (
											<></>
										)}
										<div className="col-md-12">
											<TextArea
												hasStrip
												id="description"
												name="description"
												label="Description"
												placeholder="Enter description"
												value={values.description}
												onChange={handleChange}
												onBlur={handleBlur}
												errorMessage={errors.description}
												isInvalid={errors.description && touched.description}
											/>
										</div>
										<div className="col-md-12">
											<label className="mb-3">
												Is this recurring?* (every year)
											</label>
											<div className="d-flex flex-wrap mb-3">
												<Radio
													name="recurring"
													type="radio"
													checked={values.recurring === 'yes'}
													value="yes"
													onChange={() => setFieldValue('recurring', 'yes')}
												>
													{' '}
													<p className="radio">Yes</p>
												</Radio>
												<Radio
													name="recurring"
													type="radio"
													checked={values.recurring === 'no'}
													value="no"
													onChange={() => setFieldValue('recurring', 'no')}
												>
													{' '}
													<p className="radio">No</p>
												</Radio>
											</div>
										</div>
										<div className="col-md-12">
											<MultiSelect
												label="Select Company policies*"
												placeholder="Select company policies"
												options={getCompnayPoliciesOptions()}
												onChange={(value) => {
													setFieldValue('company_policy', value);
													setFieldTouched('company_policy', true);
												}}
												value={
													isEdit && !touched.company_policy
														? getDefaultComapnies(values?.company_policy)
														: values.company_policy
												}
												name="company_policy"
											/>
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
										{isEdit ? 'Save Changes' : 'Add Holiday'}
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

AddHoliday.propTypes = propTypes;

const mapStateToProps = createStructuredSelector({
	isLoadingCompany: selectisLoadingCompanyPolicy,
	company_policies: selectAllCompanyPolicy,
	isLoading: selectisLoadingHoliday,
});
export default connect(mapStateToProps, {
	addHoliday,
	editHoliday,
	getAllCompanyPolicy,
})(AddHoliday);
