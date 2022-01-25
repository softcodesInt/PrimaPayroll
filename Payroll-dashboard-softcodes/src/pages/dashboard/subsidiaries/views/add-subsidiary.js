/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-shadow */
/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { isEqual } from 'lodash';
import { isEmpty } from 'codewonders-helpers';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import styled from 'styled-components';

import Select from 'components/select';
import Button from 'components/button';
import Input from 'components/input';
import Modal, { ModalWrap } from 'components/modal';
import Radio from 'components/radio';
import TextArea from 'components/textarea';
import { subsidiaryValidation } from 'utils/validation-schema';
import { addSubsidiary, editSubsidiary } from 'redux/subsidiary/actions';
import { selectisLoading } from 'redux/subsidiary/selectors';
import { selectAdminUsers } from 'redux/user/selectors';

const propTypes = {
	show: PropTypes.bool,
	closeModal: PropTypes.func,
	isLoading: PropTypes.bool,
	isEdit: PropTypes.bool,
	addSubsidiary: PropTypes.func,
	editSubsidiary: PropTypes.func,
	data: PropTypes.shape,
	admins: PropTypes.array,
};

const AddSubsidiaries = ({
	show,
	closeModal,
	isLoading,
	isEdit,
	data,
	editSubsidiary,
	addSubsidiary,
	admins,
}) => {
	const [imgPreview, setImgPreview] = useState(null);
	const state = isEmpty(data)
		? { name: '', address: '', admin: '', is_active: 'active' }
		: {
				...data,
				is_active: data?.is_active ? 'active' : 'inactive',
		  };

	const loadPreview = (file) => {
		if (typeof file === 'string') {
			return <img src={file} alt="" className="mr-2" />;
		}
		const reader = new FileReader();

		reader.onload = (e) => {
			setImgPreview(
				<img src={e.currentTarget.result} alt="" className="mr-2" />
			);
		};

		reader.readAsDataURL(file);
	};

	return (
		<>
			<Modal
				show={show}
				closeModal={closeModal}
				title={isEdit ? 'Edit Subsidiary' : 'Add New Subsidiary'}
			>
				<ModalWrap className="row">
					<div className="col-md-6">
						<Formik
							initialValues={state}
							validationSchema={subsidiaryValidation}
							onSubmit={async (
								{ name, address, is_active, logo, admin },
								resetForm
							) => {
								const formData = new FormData();
								formData.append('name', name);
								formData.append('address', address);
								formData.append('admin', admin);
								if (logo) {
									formData.append('logo', logo);
								}
								formData.append('is_active', is_active === 'active' || false);

								if (!isEdit) {
									try {
										await addSubsidiary?.(formData);
										closeModal();
										resetForm({});
									} catch (e) {}
								} else {
									try {
										await editSubsidiary?.(data?.id, formData);
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
								setFieldValue,
								handleBlur,
								handleSubmit,
							}) => (
								<form onSubmit={handleSubmit}>
									<label className="mb-3">Upload logo</label>
									<ImageSlate className="d-flex align-items-center">
										{values.logo && loadPreview(values.logo)}
										{values.logo ? (
											imgPreview
										) : (
											<span className="no__image">No Logo</span>
										)}
										<span className="image__layer">
											<p>Click to upload logo</p>
											<input
												id="logo"
												name="logo"
												type="file"
												accept="image/*"
												className="hidden"
												onChange={(event) => {
													setFieldValue('logo', event.currentTarget.files[0]);
												}}
											/>
										</span>
									</ImageSlate>
									<Input
										hasStrip
										id="name"
										name="name"
										type="text"
										label="Name*"
										placeholder="Enter name of the subsidiary"
										value={values.name}
										onChange={handleChange}
										onBlur={handleBlur}
										errorMessage={errors.name}
										isInvalid={errors.name && touched.name}
									/>

									<TextArea
										hasStrip
										id="address"
										name="address"
										label="Address"
										placeholder="Enter address"
										value={values.address}
										onChange={handleChange}
										onBlur={handleBlur}
										errorMessage={errors.address}
										isInvalid={errors.address && touched.address}
									/>
									<Select
										hasStrip
										id="admin"
										name="admin"
										label="Admin"
										value={values.admin}
										onChange={handleChange}
										onBlur={handleBlur}
										errorMessage={errors.admin}
										isInvalid={errors.admin && touched.admin}
									>
										<option>-Select-</option>
										{admins?.results.map((admin) => (
											<option value={admin.id}>
												{admin.user.first_name} {admin.user.last_name}
											</option>
										))}
									</Select>
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
									<Button
										type="submit"
										className="btn-soft mr-auto mt-4"
										isLoading={isLoading}
										disabled={isLoading || isEqual(values, state)}
									>
										{isEdit ? 'Save Changes' : 'Add Subsidiary'}
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
const ImageSlate = styled.div`
	margin-bottom: 1.5rem;
	.no__image {
		background: #e0e3ea;
		height: 55px;
		width: 55px;
		display: flex;
		align-items: center;
		padding: 11px;
		margin-right: 1rem;
		font-size: 12px;
		text-align: center;
		border-radius: 7px;
	}
	img {
		height: 49px;
		width: 49px;
		border-radius: 7px;
		object-fit: contain;
	}
	.image__layer {
		display: block;
		position: relative;
		p {
			font-size: 14px;
			line-height: 18px;
			margin: 0;
			letter-spacing: 0.02em;

			/* Primary/Blue-alt */

			color: #336ee4;
			cursor: pointer;
		}

		input {
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			opacity: 0;
			cursor: pointer;
		}
	}
`;
AddSubsidiaries.propTypes = propTypes;

const mapStateToProps = createStructuredSelector({
	isLoading: selectisLoading,
	admins: selectAdminUsers,
});
export default connect(mapStateToProps, { addSubsidiary, editSubsidiary })(
	AddSubsidiaries
);
