/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link, Redirect, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

/* -------------------------- Internal Dependencies ------------------------- */
import Radio from 'components/radio';
import Input from 'components/input';
import Button from 'components/button';
import { SubNavBar } from 'components/layout/dashboard-layout/navbar';
import { DashboardWrapper, DashboardActivities } from '../../';
import { connect, useDispatch } from 'react-redux';
import { selectAccountsLoading } from 'redux/accounts/selectors';
import { createStructuredSelector } from 'reselect';
import { createStaff } from 'redux/accounts/actions';
import { createStaffValdationSchema } from 'utils/validation-schema';
import { Formik } from 'formik';
import { getUserById, editStaff } from 'redux/user/actions';
import { setAlert } from 'redux/alert/actions';
import { selectAuthUser } from 'redux/user/selectors';
import isEmpty from 'codewonders-helpers/bundle-cjs/helpers/is-empty';
import { user_id } from 'utils/user_persist';

/* ----------------------------- CreateStaff propTypes ---------------------------- */
const propsTypes = {
	isLoading: PropTypes.bool,
	createStaff: PropTypes.func,
	user: PropTypes.object,
};

const CreateStaff = ({
	isLoading,
	createStaff: create,
	getUserById,
	user,
	editStaff: edit,
}) => {
	const dispatch = useDispatch();
	const isViewer = !isEmpty(user) && user?.role === 'VIEWER';

	const { id } = useParams();
	/**
	 * Check if the user has a current efficient role to access the create page else redirect
	 */
	if (isViewer && id !== user_id) {
		dispatch(
			setAlert(
				'You dont have enough permission to access this page, ask the admin for enough permission.',
				'error'
			)
		);
	}
	const [state, setState] = useState({
		first_name: '',
		last_name: '',
		email: '',
		role: '',
	});

	const fetchData = useCallback(async () => {
		const data = await getUserById(id);
		await setState((prev) => {
			return {
				...prev,
				first_name: data?.first_name,
				last_name: data?.last_name,
				email: data?.email,
				role: data?.role,
			};
		});
	}, [getUserById, id]);

	useEffect(() => {
		if (id) {
			fetchData();
		}
	}, [id, fetchData]);
	return (
		<>
			{isViewer && id !== user_id ? (
				<Redirect to="/" />
			) : (
				<>
					<SubNavBar isBack>
						<div>
							<Link to="/dashboard/staff" className="back mb-3 d-block">
								{'<'} BACK
							</Link>

							<h3>
								{id ? 'Edit' : 'Create'}{' '}
								{user_id === id ? ' Profile' : ' a Staff'}
							</h3>
						</div>
					</SubNavBar>
					<DashboardWrapper>
						<DashboardList className="mt-0">
							<div className="row">
								<div className="col-md-12">
									<div className="card">
										<div className="card-body">
											<div className="col-md-8">
												<Formik
													initialValues={state}
													enableReinitialize
													validationSchema={createStaffValdationSchema}
													onSubmit={async ({
														first_name,
														last_name,
														email,
														role,
													}) => {
														if (!id) {
															await create?.({
																first_name,
																last_name,
																email,
																role,
															});
														} else {
															await edit?.(id, {
																first_name,
																last_name,
																email,
																role,
															});
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
																<div className="col-md-6">
																	<Input
																		hasStrip
																		label="First Name"
																		id="first_name"
																		name="first_name"
																		type="text"
																		placeholder="First Name"
																		value={values.first_name}
																		onChange={handleChange}
																		onBlur={handleBlur}
																		errorMessage={errors.first_name}
																		isInvalid={
																			errors.first_name && touched.first_name
																		}
																	/>
																</div>
																<div className="col-md-6">
																	<Input
																		hasStrip
																		label="Last Name"
																		id="last_name"
																		name="last_name"
																		type="text"
																		placeholder="Last Name"
																		value={values.last_name}
																		onChange={handleChange}
																		onBlur={handleBlur}
																		errorMessage={errors.last_name}
																		isInvalid={
																			errors.last_name && touched.last_name
																		}
																	/>
																</div>
																<div className="col-md-6">
																	<Input
																		hasStrip
																		label="Email Address"
																		id="email"
																		name="email"
																		type="email"
																		placeholder="Email Address"
																		value={values.email}
																		onChange={handleChange}
																		onBlur={handleBlur}
																		errorMessage={errors.email}
																		isInvalid={errors.email && touched.email}
																	/>
																</div>
																<div className="col-md-12">
																	{user_id !== id &&
																		(!isViewer ? (
																			<>
																				<label className="mb-3">
																					Role (select one)
																				</label>
																				<Radio
																					name="role"
																					type="radio"
																					checked={values.role === 'VIEWER'}
																					value="VIEWER"
																					onChange={() =>
																						setFieldValue('role', 'VIEWER')
																					}
																				>
																					{' '}
																					<p className="radio">
																						Viewer: <small>can only view</small>
																					</p>
																				</Radio>
																				<Radio
																					name="role"
																					type="radio"
																					checked={values.role === 'OPERATOR'}
																					value="OPERATOR"
																					onChange={() =>
																						setFieldValue('role', 'OPERATOR')
																					}
																				>
																					{' '}
																					<p className="radio">
																						Operator:{' '}
																						<small>
																							can view and edit public
																							information
																						</small>
																					</p>
																				</Radio>

																				<Radio
																					name="role"
																					type="radio"
																					checked={values.role === 'ADMIN'}
																					value="ADMIN"
																					onChange={() =>
																						setFieldValue('role', 'ADMIN')
																					}
																					errorMessage={errors.role}
																					isInvalid={
																						errors.role && touched.role
																					}
																				>
																					{' '}
																					<p className="radio">
																						Admin:{' '}
																						<small>
																							{' '}
																							can view, edit and assess all
																							information
																						</small>
																					</p>
																				</Radio>
																			</>
																		) : null)}
																	<Button
																		type="submit"
																		className={`btn-soft ${(!isViewer &&
																			' mt-5') ||
																			'mt-3'}`}
																		isLoading={isLoading}
																		disabled={isLoading}
																	>
																		{!id ? '	Invite Staff' : 'Update Profile'}
																	</Button>
																</div>
															</div>
														</form>
													)}
												</Formik>
											</div>
										</div>
									</div>
								</div>
							</div>
						</DashboardList>
					</DashboardWrapper>
				</>
			)}{' '}
		</>
	);
};
export const DashboardList = styled(DashboardActivities)`
	.card {
		min-height: 75vh;
	}
	label {
		font-style: normal;
		font-weight: normal;
		font-size: 11.2px;
		line-height: 15px;
		/* identical to box height */

		/* Text/Black */

		color: #141515;
	}
	.radio {
		font-style: normal;
		font-weight: normal;
		font-size: 14px;
		line-height: 18px;
		letter-spacing: 0.02em;

		color: #141515;
	}
`;

CreateStaff.propTypes = propsTypes;
const mapStateToProps = createStructuredSelector({
	isLoading: selectAccountsLoading,
	user: selectAuthUser,
});
export default connect(mapStateToProps, {
	createStaff,
	getUserById,
	editStaff,
})(CreateStaff);
