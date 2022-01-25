/* eslint-disable react/button-has-type */
/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React, { useState, useRef } from 'react';
import styled from 'styled-components';
/* -------------------------- Internal Dependencies ------------------------- */
import NavLayout from 'components/layout/dashboard-layout/navbar';
import { useMount } from 'broad-state';
import { DashboardSubWrapper } from 'pages/dashboard/company-structure';
import { connect } from 'react-redux';
import { debounce, isEmpty } from 'codewonders-helpers';
import { createStructuredSelector } from 'reselect';
import AutoCompleteInput from 'components/autocomplete-input';
import { ReactComponent as Loading } from 'assets/icons/loading.svg';
import { Formik } from 'formik';
import { getAllEmployees } from 'redux/employee/actions';
import { selectAllEmployees, selectisLoading } from 'redux/employee/selectors';
import {
	selectisLoading as selectEmployeeReliefLoading,
	selectEmployeeDrivenTaxRelief,
} from 'redux/payroll/selectors';
import {
	getEmployeeDrivenTaxRelief,
	addEmployeeRelief,
} from 'redux/payroll/actions';

import EmployeeStructure from 'redux/employee/types';
import { leaveWorkflowSchema } from 'utils/validation-schema';
import ReliefForm from './relief-form';

const EmployeeDrivenTaxRelief = ({
	getAllEmployees,
	isLoading,
	employees,
	dispatch,
	getEmployeeDrivenTaxRelief,
	employeeReliefLoading,
	employeeReliefs,
	addEmployeeRelief,
}) => {
	useMount(() => {
		getAllEmployees();
	});

	const [searchTerm, setSearchTerm] = useState('');
	const [employeeId, setActiveEmployeeId] = useState('');
	const previousSearchTermRef = useRef('');

	const search = debounce(async (value) => {
		if (previousSearchTermRef.current === value) {
			try {
				// await refetch();
			} finally {
				await getAllEmployees(value);
			}
		}
	}, 500);

	const state = {};

	const formatEmployeeRelief = () => {
		const formattedData = [];
		if (employeeReliefs && employeeReliefs.tax_relief) {
			// eslint-disable-next-line
			employeeReliefs.tax_relief.map((relief) => {
				// eslint-disable-next-line
				formattedData.push({
					id: relief.tax_relief.id,
					amount: relief.value,
				});
			});
		}

		return {
			relief: formattedData,
		};
	};

	return (
		<>
			<NavLayout title="Employee Driven Tax Relief" isBack />
			<DashboardSubWrapper className="wrapper-contain">
				<h4 className="page-main-title">Manage Employee Tax Relief</h4>
				<SectionHeadsnItems className="main-table-wrapper">
					<div className="row">
						<div className="col-sm-12 offset-sm-1">
							<Formik
								initialValues={{
									employee: '',
									leave: '',
									number_of_days: '',
									start_date: '',
								}}
								onSubmit={(values) => console.log()}
								validationSchema={leaveWorkflowSchema}
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
									<div className="row mt-5">
										<div className="col-sm-6">
											<AutoCompleteInput
												hasStrip
												id="employee"
												name="employee"
												type="text"
												label="Select Employee*"
												placeholder="Search and Select an employee"
												value={searchTerm || state.parent?.split(',')[0]}
												onChange={(e) => {
													setSearchTerm(e.target.value);
													previousSearchTermRef.current = e.target.value;
													search(e.target.value);
													setActiveEmployeeId(e.target.value);
												}}
												activeClassName={
													searchTerm &&
													searchTerm === values?.parent?.split(',')[0]
												}
												onBlur={handleBlur}
												errorMessage={errors.parent}
												isInvalid={errors.parent && touched.parent}
											>
												{' '}
												{!isLoading ? (
													<>
														{!isEmpty(employees?.results) ? (
															<>
																{employees?.results?.map((employee) => (
																	<button
																		onClick={(e) => {
																			e.preventDefault();
																			getEmployeeDrivenTaxRelief(employee?.id);
																			setSearchTerm(
																				`${employee?.first_name} ${employee?.last_name} - ${employee.employee_code}`
																			);
																			setFieldValue('employee', employee?.id);
																			setActiveEmployeeId(employee?.id);
																			dispatch({
																				type: EmployeeStructure.GET_EMPLOYEE,
																				payload: {
																					loading: false,
																					data: employee,
																				},
																			});
																		}}
																		className="button"
																	>
																		<p>{employee?.first_name}</p>
																	</button>
																))}
															</>
														) : (
															<p className="mx-2 text-center">
																No Employee found
															</p>
														)}
													</>
												) : (
													<Loading />
												)}
											</AutoCompleteInput>
										</div>
									</div>
								)}
							</Formik>
						</div>
					</div>
					<div className="row">
						{employeeId && !employeeReliefLoading && (
							<div className="row">
								<div className="col-sm-12">
									<ReliefForm
										initialValues={formatEmployeeRelief()}
										addEmployeeRelief={addEmployeeRelief}
										employeeId={employeeId}
										transactionLoading={employeeReliefLoading}
										elements={employeeReliefs}
									/>
								</div>
							</div>
						)}
					</div>
				</SectionHeadsnItems>
			</DashboardSubWrapper>
		</>
	);
};

const SectionHeadsnItems = styled.div`
	margin-top: 2rem;
	background: #ffffff;
	justify-content: center;
	padding: 2rem;
`;

const mapStateToProps = createStructuredSelector({
	isLoading: selectisLoading,
	employees: selectAllEmployees,
	employeeReliefLoading: selectEmployeeReliefLoading,
	employeeReliefs: selectEmployeeDrivenTaxRelief,
});

const mapDispatchToProps = (dispatch) => {
	return {
		dispatch: (data) => dispatch(data),
		getAllEmployees: (data) => dispatch(getAllEmployees(data)),
		getEmployeeDrivenTaxRelief: (id) =>
			dispatch(getEmployeeDrivenTaxRelief(id)),
		addEmployeeRelief: (id, data) => dispatch(addEmployeeRelief(id, data)),
	};
};
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EmployeeDrivenTaxRelief);
