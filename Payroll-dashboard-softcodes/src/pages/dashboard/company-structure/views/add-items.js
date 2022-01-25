import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import { isEqual, debounce } from 'lodash';
import Button from 'components/button';
import Input from 'components/input';
import Modal, { ModalWrap } from 'components/modal';
import Radio from 'components/radio';
import TextArea from 'components/textarea';
import { itemValidation } from 'utils/validation-schema';
import { createStructuredSelector } from 'reselect';
import {
	addItemOrHead,
	editItemOrHead,
	getAllCompanyStructure,
} from 'redux/company-structure/actions';
import {
	selectisLoading,
	selectisLoadingAll,
	selecAllStructures,
} from 'redux/company-structure/selectors';
import { selectAllCompanyPolicy } from 'redux/company-policy/selectors';
import isEmpty from 'codewonders-helpers/bundle-cjs/helpers/is-empty';
import { ReactComponent as Loading } from 'assets/icons/loading.svg';
import AutoCompleteInput from 'components/autocomplete-input';
import { useParams } from 'react-router-dom';
import { MultiSelect } from 'components/select';
const propTypes = {
	show: PropTypes.bool,
	closeModal: PropTypes.func,
	addItemOrHead: PropTypes.func,
	data: PropTypes.object,
	isLoading: PropTypes.bool,
	isEdit: PropTypes.bool,
	policies: PropTypes.array,
};

const AddItem = ({
	show,
	closeModal,
	isLoading,
	isLoadingAll,
	addItemOrHead,
	editItemOrHead,
	isEdit,
	getAllCompanyStructure,
	allStructures,
	policies,
	data,
}) => {
	const state = isEmpty(data)
		? { name: '', description: '', is_active: 'active' }
		: {
				...data,
				parent: `${data?.parent?.name},${data?.parent?.id}`,
				is_active: data?.is_active ? 'active' : 'inactive',
		  };

	const [searchTerm, setSearchTerm] = useState('');
	const { id } = useParams();
	const previousSearchTermRef = useRef('');
	const search = debounce(async (value) => {
		if (previousSearchTermRef.current === value) {
			try {
				// await refetch();
			} finally {
				await getAllCompanyStructure(value);
			}
		}
	}, 500);

	const getPolicyOptions = () => {
		if (!isEmpty(policies?.results)) {
			return policies.results.map((data) => {
				return {
					value: data.id,
					label: data.name,
				};
			});
		}
		return [];
	};

	const getDefaultPolicies = (value) => {
		let d;
		let formattedData;
		if (!isEmpty(value)) {
			d = value?.filter((option) => {
				return getPolicyOptions()?.filter((data) => data.id === option.value);
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
				closeModal={() => {
					closeModal();
					getAllCompanyStructure();
				}}
				title={isEdit ? 'Edit Item' : 'Add New Item'}
				description="Create your company structure's low hierarchy here. E.g IT Department, Lagos Branch"
			>
				<ModalWrap>
					<div className="col-md-6">
						<Formik
							initialValues={state}
							enableReinitialize
							validationSchema={itemValidation}
							onSubmit={async (
								{ name, description, is_active, parent, company_policy },
								resetForm
							) => {
								if (!isEdit) {
									try {
										await addItemOrHead?.({
											name,
											description,
											is_active: is_active === 'active' || false,
											is_header: false,
											company_policy: company_policy.map((item) => item.value),
											parent: parent?.split(',')[1],
										});
										closeModal();
										resetForm({});
									} catch (e) {}
								} else {
									try {
										await editItemOrHead?.(
											data?.id,
											{
												name,
												description,
												is_active: is_active === 'active' || false,
												is_header: false,
												parent: parent?.split(',')[1],
												company_policy: company_policy.map(
													(item) => item.value || item.id
												),
											},
											id
										);
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
									<AutoCompleteInput
										hasStrip
										id="parent"
										name="parent"
										type="text"
										label="Select Head*"
										placeholder="Search and Select head to add item"
										value={searchTerm || state.parent?.split(',')[0]}
										onChange={(e) => {
											setSearchTerm(e.target.value);
											previousSearchTermRef.current = e.target.value;
											search(e.target.value);
										}}
										activeClassName={
											searchTerm && searchTerm === values?.parent?.split(',')[0]
										}
										onBlur={handleBlur}
										errorMessage={errors.parent}
										isInvalid={errors.parent && touched.parent}
									>
										{' '}
										{!isLoadingAll ? (
											<>
												{!isEmpty(allStructures?.results) ? (
													<>
														{allStructures?.results?.map((heads) => (
															<button
																type="button"
																onClick={(e) => {
																	e.preventDefault();
																	setSearchTerm(`${heads?.name}`);
																	setFieldValue(
																		'parent',
																		`${heads?.name},${heads?.id}`
																	);
																}}
																className="button"
															>
																<p>{heads?.name}</p>
															</button>
														))}
													</>
												) : (
													<p className="mx-2 text-center">No head found</p>
												)}
											</>
										) : (
											<Loading />
										)}
									</AutoCompleteInput>

									<Input
										hasStrip
										id="name"
										name="name"
										type="text"
										label="Name*"
										placeholder="Enter name of the item"
										value={values.name}
										onChange={handleChange}
										onBlur={handleBlur}
										errorMessage={errors.name}
										isInvalid={errors.name && touched.name}
									/>

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
									<label className="mb-3">Status*</label>
									<div className="d-flex flex-wrap">
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
											onChange={() => setFieldValue('is_active', 'inactive')}
										>
											{' '}
											<p className="radio">Inactive</p>
										</Radio>
									</div>
									<MultiSelect
										label="Select Policies*"
										placeholder="Select policies"
										options={getPolicyOptions()}
										onChange={(value) => {
											setFieldValue('company_policy', value);
											setFieldTouched('company_policy', true);
										}}
										value={
											isEdit && !touched.company_policy
												? getDefaultPolicies(values?.company_policy)
												: values.company_policy
										}
										name="company_policy"
									/>
									<Button
										type="submit"
										className="btn-soft mr-auto mt-4"
										isLoading={isLoading}
										disabled={isLoading || isEqual(values, state)}
									>
										{isEdit ? 'Save Changes' : 'Add Item'}
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

AddItem.propTypes = propTypes;
const mapStateToProps = createStructuredSelector({
	isLoading: selectisLoading,
	allStructures: selecAllStructures,
	isLoadingAll: selectisLoadingAll,
	policies: selectAllCompanyPolicy,
});
export default connect(mapStateToProps, {
	addItemOrHead,
	editItemOrHead,
	getAllCompanyStructure,
})(AddItem);
