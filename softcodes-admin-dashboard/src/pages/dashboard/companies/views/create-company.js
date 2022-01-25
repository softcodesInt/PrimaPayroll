/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Link, Redirect, useParams, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Formik } from 'formik';
import { useMount } from 'broad-state';
import { debounce } from 'lodash';
import isEmpty from 'codewonders-helpers/bundle-cjs/helpers/is-empty';

/* -------------------------- Internal Dependencies ------------------------- */
import Input, { ErrorText } from 'components/input';
import Button from 'components/button';
import { SubNavBar } from 'components/layout/dashboard-layout/navbar';
import Radio from 'components/radio';

import {
	selectAccountsLoading,
	selectCompanyLoading,
	selectCurrentCompany,
	selectCurrentStaffs,
	selectStaffLoading,
} from 'redux/accounts/selectors';

import {
	createCompany,
	getCompanyById,
	editCompany,
	getStaffs,
} from 'redux/accounts/actions';
import { createCompanyValdationSchema } from 'utils/validation-schema';
import { DashboardWrapper, DashboardActivities } from '../..';
import Avatar from 'components/avatar';

/* ---------------------------- Image Dependency ---------------------------- */
import { ReactComponent as Loading } from 'assets/icons/loading.svg';
import Arrow from 'assets/icons/icon-arrow-down.svg';
import { ReactComponent as Copy } from 'assets/icons/icon-copy.svg';
import { copyToClipboard, getQueryParams } from 'utils';
import Loader from 'components/loader';
import { selectAuthUser } from 'redux/user/selectors';
import { setAlert } from 'redux/alert/actions';
/* ----------------------------- CreateCompany propTypes ---------------------------- */
const propsTypes = {
	isLoading: PropTypes.bool,
	isStaffLoading: PropTypes.bool,
	isCompany: PropTypes.bool,
	createCompany: PropTypes.func,
	editCompany: PropTypes.func,
	staffs: PropTypes.array,
	router: PropTypes.object,
	user: PropTypes.object,
	getStaffs: PropTypes.func,
};

const CreateCompany = ({
	isLoading,
	createCompany: create,
	getStaffs,
	company,
	user,
	getCompanyById,
	editCompany: edit,
	isCompany,
	isStaffLoading,
	staffs,
}) => {
	const dispatch = useDispatch();
	/**
	 * Check if the user has a current efficient role to access the create page else redirect
	 */
	if (!isEmpty(user) && user?.role !== 'ADMIN') {
		dispatch(
			setAlert(
				'You dont have enough permission to access this page, ask the admin for enough permission.',
				'error'
			)
		);
	}

	const [searchTerm, setSearchTerm] = useState('');
	const [contact, setContact] = useState('');
	const [state, setState] = useState({
		name: '',
		phone_number: '',
		email: '',
		address: '',
		subscription: '',
		employee_count: '',
		bought_payroll: true,
		bought_ess: false,
		blame: '',
		contacts_name: '',
		contacts_email: '',
		contacts_phone_number: '',
	});
	const previousSearchTermRef = useRef('');
	const { id } = useParams();
	const { token, company: companyName } = getQueryParams();

	useMount(() => {
		if (isEmpty(staffs)) {
			getStaffs();
		}
	});
	const fetchData = useCallback(async () => {
		const data = await getCompanyById(id);
		await setState((prev) => {
			return {
				...prev,
				name: data?.name,
				phone_number: data?.phone_number,
				email: data?.email,
				address: data?.address,
				subscription: data.subscription,
				employee_count: data?.employee_count,
				bought_payroll: data?.bought_payroll,
				bought_ess: data?.bought_ess,
				blame: data?.blame,
				subscription_year: data?.subscription_year,
				subscription_month: data?.subscription_month,
				contacts_name: data?.contacts_name,
				contacts_email: data?.contacts_email,
				contacts_phone_number: data?.contacts_phone_number,
			};
		});
		setContact(
			`${data?.blame_info?.first_name} ${data?.blame_info?.last_name}`
		);
		setSearchTerm(
			`${data?.blame_info?.first_name} ${data?.blame_info?.last_name}`
		);
	}, [getCompanyById, id]);
	useEffect(() => {
		if (id) {
			fetchData();
		}
	}, [id, fetchData]);
	const searchStaff = debounce(async (value) => {
		if (previousSearchTermRef.current === value) {
			try {
				// await refetch();
			} finally {
				await getStaffs({ searchQuery: value });
			}
		}
	}, 500);

	return (
		<>
			{!isEmpty(user) && user?.role !== 'ADMIN' ? (
				<Redirect to="/" />
			) : (
				<>
					<SubNavBar isBack>
						<div>
							<Link to="/dashboard/companies" className="back mb-3 d-block">
								{'<'} BACK
							</Link>

							<h3>{id ? `Edit Company ${state.name}` : 'Create a Company'}</h3>
						</div>
					</SubNavBar>
					<DashboardWrapper>
						<DashboardList className="mt-0">
							<div className="row">
								<div className="col-md-12">
									<div className="card">
										<div className="card-body">
											{!companyName && !token ? (
												<>
													{!isCompany && !isEmpty(company) ? (
														<div className="col-md-11">
															<Formik
																initialValues={state}
																enableReinitialize
																validationSchema={createCompanyValdationSchema}
																onSubmit={async ({
																	name,
																	phone_number,
																	email,
																	address,
																	subscription_year,
																	subscription_month,

																	employee_count,
																	blame,
																	contacts_name,
																	contacts_email,
																	contacts_phone_number,
																	bought_payroll,
																	bought_ess,
																}) => {
																	if (!id) {
																		await create?.({
																			name,
																			phone_number,
																			email,
																			address,

																			contacts_name,
																			contacts_email,
																			contacts_phone_number,
																			employee_count,
																			subscription_year,
																			subscription_month,
																			bought_payroll,
																			blame,
																			bought_ess,
																		});
																	} else {
																		await edit?.(id, {
																			name,
																			phone_number,
																			email,
																			address,
																			subscription_year,
																			subscription_month,
																			contacts_name,
																			contacts_email,
																			contacts_phone_number,
																			employee_count,
																			bought_payroll,
																			blame,
																			bought_ess,
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
																			<div className="col-md-4">
																				<Input
																					hasStrip
																					label="Company Name"
																					id="name"
																					name="name"
																					type="text"
																					placeholder="Company Name"
																					value={values.name}
																					onChange={handleChange}
																					onBlur={handleBlur}
																					errorMessage={errors.name}
																					isInvalid={
																						errors.name && touched.name
																					}
																				/>
																			</div>
																			<div className="col-md-4">
																				<Input
																					hasStrip
																					label="Company Email Address"
																					id="email"
																					name="email"
																					type="email"
																					placeholder="Email Address"
																					value={values.email}
																					onChange={handleChange}
																					onBlur={handleBlur}
																					errorMessage={errors.email}
																					isInvalid={
																						errors.email && touched.email
																					}
																				/>
																			</div>
																			<div className="col-md-4">
																				<Input
																					hasStrip
																					label="Contacts Name"
																					id="contacts_name"
																					name="contacts_name"
																					type="text"
																					placeholder="Contacts Name"
																					value={values.contacts_name}
																					onChange={handleChange}
																					onBlur={handleBlur}
																					errorMessage={errors.contacts_name}
																					isInvalid={
																						errors.contacts_name &&
																						touched.contacts_name
																					}
																				/>
																			</div>
																			<div className="col-md-4">
																				<Input
																					hasStrip
																					label="Company's Address"
																					id="address"
																					name="address"
																					type="text"
																					placeholder="Company's Address"
																					value={values.address}
																					onChange={handleChange}
																					onBlur={handleBlur}
																					errorMessage={errors.address}
																					isInvalid={
																						errors.address && touched.address
																					}
																				/>
																			</div>
																			<div className="col-md-4">
																				<Input
																					hasStrip
																					label="Company's Phone Number"
																					id="phone_number"
																					name="phone_number"
																					type="text"
																					placeholder="Company's Phone Number"
																					value={values.phone_number}
																					onChange={handleChange}
																					onBlur={handleBlur}
																					errorMessage={errors.phone_number}
																					isInvalid={
																						errors.phone_number &&
																						touched.phone_number
																					}
																				/>
																			</div>
																			<div className="col-md-4">
																				<Input
																					hasStrip
																					label="Contacts Email"
																					id="contacts_email"
																					name="contacts_email"
																					type="email"
																					placeholder="Contacts Email"
																					value={values.contacts_email}
																					onChange={handleChange}
																					onBlur={handleBlur}
																					errorMessage={errors.contacts_email}
																					isInvalid={
																						errors.contacts_email &&
																						touched.contacts_email
																					}
																				/>
																			</div>
																			<div className="col-md-4">
																				<Input
																					hasStrip
																					label="Number of Employees"
																					id="employee_count"
																					name="employee_count"
																					type="number"
																					placeholder="Number of Employees"
																					value={values.employee_count}
																					onChange={handleChange}
																					onBlur={handleBlur}
																					errorMessage={errors.employee_count}
																					isInvalid={
																						errors.employee_count &&
																						touched.employee_count
																					}
																				/>
																			</div>
																			<div className="col-md-4">
																				<div className="row">
																					<div className="col-md-6">
																						<Input
																							hasStrip
																							label="Years of subscription"
																							id="subscription_year"
																							name="subscription_year"
																							type="number"
																							placeholder="Years"
																							value={values.subscription_year}
																							onChange={handleChange}
																							onBlur={handleBlur}
																							errorMessage={
																								errors.subscription_year
																							}
																							isInvalid={
																								errors.subscription_year &&
																								touched.subscription_year
																							}
																						/>
																					</div>
																					<div className="col-md-6">
																						<Input
																							hasStrip
																							label="Months of subscription"
																							id="subscription_month"
																							name="subscription_month"
																							type="number"
																							placeholder="Month"
																							value={values.subscription_month}
																							onChange={handleChange}
																							onBlur={handleBlur}
																							errorMessage={
																								errors.subscription_month
																							}
																							isInvalid={
																								errors.subscription_month &&
																								touched.subscription_month
																							}
																						/>
																					</div>
																				</div>
																			</div>
																			<div className="col-md-4">
																				<Input
																					hasStrip
																					label="Contacts Phone Number"
																					id="contacts_phone_number"
																					name="contacts_phone_number"
																					type="text"
																					placeholder="Contacts Phone Number"
																					value={values.contacts_phone_number}
																					onChange={handleChange}
																					onBlur={handleBlur}
																					errorMessage={
																						errors.contacts_phone_number
																					}
																					isInvalid={
																						errors.contacts_phone_number &&
																						touched.contacts_phone_number
																					}
																				/>
																			</div>
																			<div className="col-md-4">
																				<label className="mb-3">
																					Package bought (select one)
																				</label>
																				<Radio checked={true} disabled>
																					{' '}
																					<p className="radio">Payroll</p>
																				</Radio>
																				<Radio
																					name="bought_ess"
																					type="radio"
																					checked={values.bought_ess === true}
																					label="bought_ess"
																					value={values.bought_ess}
																					onChange={() =>
																						setFieldValue('bought_ess', true)
																					}
																				>
																					{' '}
																					<p className="radio">
																						Employee Self Service (ESS)
																					</p>
																				</Radio>
																			</div>
																			<div className="col-md-4">
																				<label className="mb-3">
																					Assign To
																				</label>
																				<input
																					id="creators"
																					name="creators"
																					type="text"
																					autoComplete="off"
																					className={`auto__input form-control ${
																						searchTerm && searchTerm === contact
																							? 'active'
																							: ''
																					}`}
																					placeholder="Search and Select staff to manage company"
																					value={searchTerm}
																					onChange={(e) => {
																						setSearchTerm(e.target.value);
																						previousSearchTermRef.current =
																							e.target.value;
																						searchStaff(e.target.value);
																					}}
																				/>

																				<div className="auto__complete">
																					{!isStaffLoading ? (
																						<>
																							{!isEmpty(staffs) ? (
																								<>
																									{staffs?.map((staff) => (
																										<div
																											className="media align-items-center"
																											onClick={() => {
																												setSearchTerm(
																													`${staff?.first_name} ${staff?.last_name}`
																												);
																												setFieldValue(
																													'blame',
																													`${staff?.id}`
																												);
																												setContact(
																													`${staff?.first_name} ${staff?.last_name}`
																												);
																											}}
																										>
																											{staff?.profile_picture ? (
																												<img
																													src={
																														staff?.profile_picture
																													}
																													alt="Profile"
																												/>
																											) : (
																												<Avatar
																													data={staff}
																													size="2.2em"
																												/>
																											)}
																											<div className="media-body">
																												<p>
																													{staff?.first_name}{' '}
																													{staff?.last_name}
																												</p>
																											</div>
																										</div>
																									))}
																								</>
																							) : (
																								<div className="media align-items-center">
																									<p>No user found</p>
																								</div>
																							)}
																						</>
																					) : (
																						<Loading />
																					)}
																				</div>

																				{errors.blame && touched.blame ? (
																					<ErrorText>{errors.blame}</ErrorText>
																				) : null}
																			</div>
																			<div className="col-md-4"></div>
																			<Button
																				type="submit"
																				className="btn-soft mt-5"
																				isLoading={isLoading}
																				disabled={isLoading}
																			>
																				{id
																					? 'Update Company'
																					: 'Generate Code'}
																			</Button>
																		</div>
																	</form>
																)}
															</Formik>
														</div>
													) : (
														<Loader loadingText="Getting Information" />
													)}
												</>
											) : (
												<div className="col-md-6 m-auto copyCode">
													<h5>{companyName} Generated code</h5>
													<div className="d-flex copy__data justify-content-between align-items-center">
														<h4>{token}</h4>
														<span
															onClick={async () => {
																await copyToClipboard();
																alert('Copied to clipboard');
															}}
														>
															<Copy />
														</span>
													</div>
													<Link to="/dashboard/companies">
														<Button className="btn-soft mr-auto ml-auto mt-4">
															Save Code
														</Button>
													</Link>
												</div>
											)}
										</div>
									</div>
								</div>
							</div>
						</DashboardList>
					</DashboardWrapper>
				</>
			)}
		</>
	);
};
export const DashboardList = styled(DashboardActivities)`
	.card {
		min-height: 75vh;
	}
	.copyCode {
		padding-top: 4.5rem;
		h5 {
			font-style: normal;
			font-weight: 500;
			font-size: var(--font-h4);
			line-height: 23px;
			text-align: center;
			/* identical to box height */

			letter-spacing: -0.015em;

			/* Text/Grey */

			color: #4c4e51;
		}
		span {
			background: rgba(196, 196, 196, 0.2);
			border-radius: 4px;
			display: block;
			padding: 18px;
			cursor: pointer;
		}
		h4 {
			font-weight: 500;
			font-size: var(--font-h2);
			line-height: 36px;
			/* identical to box height */
			flex: 0 90%;
			text-align: center;
			letter-spacing: -0.015em;

			/* Text/Black */

			color: #141515;
		}
		.copy__data {
			background: #f8f8f9;
			border-radius: 4px;
			padding: 7px 12px;
		}
	}
	.auto__complete {
		max-height: 200px;
		/* border: 1px solid red; */
		width: 93%;
		display: none;
		position: absolute;
		background: #ffffff;
		border: 0.5px solid rgba(0, 0, 0, 0.2);
		box-sizing: border-box;
		box-shadow: 4px 4px 30px -11px rgba(123, 133, 137, 0.15);
		border-radius: 4px;
		overflow: scroll;
		padding: 15px;
		svg {
			width: 40px;
			height: auto;

			circle {
				stroke: #17558e;
			}
		}
		.media {
			border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
			margin-bottom: 5px;
			padding: 10px 4px;
			cursor: pointer;
			&:hover {
				background: #f3f3f3;
			}
			img {
				width: 31px;
				height: 31px;
				object-fit: cover;
				border-radius: 50%;
			}
			p {
				font-size: var(--font-accent);
				line-height: 15px;
				/* identical to box height */
				margin-bottom: 0px;
				letter-spacing: 0.01em;

				/* Text/Black */

				color: var(--text-black);
			}
		}
		&:focus,
		&:visited,
		&:active,
		&:hover {
			display: block;
		}
	}

	.auto__input {
		border: none;
		box-sizing: border-box;
		background: #f8f8f9;
		border-radius: 8px;
		box-sizing: border-box;
		font-style: normal;
		font-family: var(--font-primary);
		font-weight: normal;

		font-size: var(--font-p);
		line-height: 18px;
		letter-spacing: 0.01em;
		/* identical to box height */

		padding: 1.4rem 1.3rem;
		box-shadow: none;
		line-height: 150%;
		/* identical to box height, or 24px */

		color: #8f9bb3;
		background-image: url(${Arrow});

		background-position: 96% center;
		background-repeat: no-repeat;

		&:focus {
			border: 1px solid var(--primary-blue) !important;
			box-shadow: none !important;
		}
		&.active {
			color: #237cce !important;
			font-weight: 900 !important;
		}
	}

	.auto__input:focus + .auto__complete {
		display: block;
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

CreateCompany.propTypes = propsTypes;
const mapStateToProps = createStructuredSelector({
	isLoading: selectAccountsLoading,
	isStaffLoading: selectStaffLoading,
	isCompany: selectCompanyLoading,
	company: selectCurrentCompany,
	user: selectAuthUser,
	staffs: selectCurrentStaffs,
});
export default connect(mapStateToProps, {
	createCompany,
	getStaffs,
	getCompanyById,
	editCompany,
})(withRouter(CreateCompany));
