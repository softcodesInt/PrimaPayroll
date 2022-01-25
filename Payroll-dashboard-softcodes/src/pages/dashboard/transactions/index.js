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
import { Button } from 'react-bootstrap';
import { getAllEmployees } from 'redux/employee/actions';
import { selectAllEmployees, selectisLoading } from 'redux/employee/selectors';
import {
	getEmployeeTransaction,
	addEmployeeTransaction,
	getBankLetter,
	getPayrollReadyForTransaction,
} from 'redux/payroll/actions';
import {
	selectEmployeeTransactions,
	selectisLoading as selectTransactionLoading,
} from 'redux/payroll/selectors';
import EmployeeStructure from 'redux/employee/types';
import PayslipDetail from 'pages/dashboard/employees/components/payslip-detail';
import TransactionForm from './monthly-form';

const Transactions = ({
	getAllEmployees,
	isLoading,
	employees,
	dispatch,
	getEmployeeTransaction,
	addEmployeeTransaction,
	transactions,
	transactionLoading,
	getBankLetter,
	getPayrollReadyForTransaction,
}) => {
	useMount(() => {
		getPayrollReadyForTransaction();
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

	const formatActiveTransactions = () => {
		if (transactionLoading) {
			return {
				transactions: [{}],
			};
		}
		if (transactions?.transactions?.employee) {
			const t = transactions.transactions;
			return {
				transactions: [...t.earnings, ...t.deductions],
			};
		}
		return {
			transactions: [{}],
		};
	};

	return (
		<>
			<NavLayout title="Transactions" isBack />
			<DashboardSubWrapper className="wrapper-contain">
				<h4 className="page-main-title">Monthly Employee Payroll</h4>
				<SectionHeadsnItems className="main-table-wrapper">
					<p className="ml-5" style={{ fontSize: '13px' }}>
						You can specify the monthly value for each payroll elements with the{' '}
						<br />
						calculation type specified as <b>NONE</b>.<br />
						When you are done with all the employees, click on the Generate
						Report button <br />
						to download the Payroll Report and Bank Letter. <br />
						You can also use these report to verify the amount that is expected
						to be disbursed for salary.
					</p>
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
																			getEmployeeTransaction(employee?.id);
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
										<div className="row">
											<div className="col-sm-8">
												{employeeId && (
													<>
														<h5>
															Update <strong>{searchTerm}</strong> payment for
															next salary
														</h5>
														<PayslipDetail showHistory={false} />
													</>
												)}
											</div>
										</div>
									</div>
								)}
							</Formik>
						</div>
					</div>
					<div className="row">
						{employeeId && !transactionLoading && (
							<div className="row">
								<div className="col-sm-12">
									<TransactionForm
										initialValues={formatActiveTransactions()}
										addEmployeeTransaction={addEmployeeTransaction}
										employeeId={employeeId}
										activeId={transactions?.transactions?.id}
										transactionLoading={transactionLoading}
										elements={transactions?.payroll_choices}
									/>
								</div>
							</div>
						)}
					</div>
					<div className="row mt-5">
						<div className="col-md-3 col-sm-3">
							<Button
								variant="info"
								type="button"
								onClick={() => {
									getBankLetter();
								}}
							>
								Generate Report
							</Button>
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
});

const mapDispatchToProps = (dispatch) => {
	return {
		dispatch: (data) => dispatch(data),
		getAllEmployees: (data) => dispatch(getAllEmployees(data)),
		getBankLetter: () => dispatch(getBankLetter()),
		getEmployeeTransaction: (data) => dispatch(getEmployeeTransaction(data)),
		addEmployeeTransaction: (id, data, activeId) =>
			dispatch(addEmployeeTransaction(id, data, activeId)),
		getPayrollReadyForTransaction: () =>
			dispatch(getPayrollReadyForTransaction()),
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(Transactions);
