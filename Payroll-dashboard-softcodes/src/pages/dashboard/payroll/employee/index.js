/* eslint-disable array-callback-return */
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
import { getAllEmployees, getEmployeeById } from 'redux/employee/actions';
import { addEmployeeDrivenPayroll } from 'redux/payroll/actions';
import {
	selectAllEmployees,
	selectisLoading,
	selectEmployee,
} from 'redux/employee/selectors';
import {
	selectEmployeeTransactions,
	selectisLoading as selectTransactionLoading,
} from 'redux/payroll/selectors';
import EmployeeStructure from 'redux/employee/types';
import PayslipDetail from 'pages/dashboard/employees/components/payslip-detail';
import EmployeeDrivenForm from './form';

const EmployeeDrivenPayroll = ({
	getAllEmployees,
	getEmployeeById,
	addEmployeeDrivenPayroll,
	isLoading,
	employees,
	selectedEmployee,
	dispatch,
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

	const formatEmployeePayroll = () => {
		const formattedData = [];
		if (selectedEmployee && selectedEmployee.remuneration) {
			// eslint-disable-next-line
			selectedEmployee.remuneration.payroll_elements.map((payroll_line) => {
				if (payroll_line.calculation_type === 'EMPLOYEE_DRIVEN') {
					// eslint-disable-next-line
					const payrollData = selectedEmployee.payroll_data;
					payrollData.earnings.map((e) => {
						if (e.name === payroll_line.name) {
							formattedData.push({
								id: payroll_line.id,
								calculation_type_value: e.amount,
							});
						}
					});
					payrollData.deductions.map((e) => {
						if (e.name === payroll_line.name) {
							formattedData.push({
								id: payroll_line.id,
								calculation_type_value: e.amount,
							});
						}
					});
				}
			});
		}

		return {
			payrollLines: formattedData,
		};
	};

	return (
		<>
			<NavLayout title="Transactions" isBack />
			<DashboardSubWrapper className="wrapper-contain">
				<h4 className="page-main-title">Employee Driven Payroll</h4>
				<SectionHeadsnItems className="main-table-wrapper">
					<div className="row">
						<div className="col-sm-12 offset-sm-1">
							<Formik
								initialValues={{
									employee: '',
								}}
								onSubmit={(values) => console.log(values)}
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
																			setSearchTerm(
																				`${employee?.first_name} ${employee?.last_name} - ${employee.employee_code}`
																			);
																			setFieldValue('employee', employee?.id);
																			getEmployeeById(employee?.id);
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
										<div className="row">
											<div className="col-sm-8 col-md-8">
												{employeeId && selectedEmployee && (
													<PayslipDetail showHistory={false} />
												)}
											</div>
										</div>
										<div className="row">
											<div className="col-sm-8 col-md-12">
												{employeeId &&
													selectedEmployee &&
													selectedEmployee?.remuneration && (
														<EmployeeDrivenForm
															employeeId={employeeId}
															data={selectedEmployee?.remuneration.payroll_elements.filter(
																(e) => e.calculation_type === 'EMPLOYEE_DRIVEN'
															)}
															initialValues={formatEmployeePayroll()}
															addEmployeeDrivenPayroll={
																addEmployeeDrivenPayroll
															}
														/>
													)}
											</div>
										</div>
									</div>
								)}
							</Formik>
						</div>
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
	transactions: selectEmployeeTransactions,
	transactionLoading: selectTransactionLoading,
	selectedEmployee: selectEmployee,
});

const mapDispatchToProps = (dispatch) => {
	return {
		dispatch: (data) => dispatch(data),
		getAllEmployees: (data) => dispatch(getAllEmployees(data)),
		getEmployeeById: (data) => dispatch(getEmployeeById(data)),
		addEmployeeDrivenPayroll: (employeeId, data) =>
			dispatch(addEmployeeDrivenPayroll(employeeId, data)),
	};
};
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EmployeeDrivenPayroll);
