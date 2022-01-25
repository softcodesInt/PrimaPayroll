import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Formik } from 'formik';
import moment from 'moment';
import { Table } from 'react-bootstrap';

import NavLayout from 'components/layout/dashboard-layout/navbar';

import isEmpty from 'codewonders-helpers/bundle-cjs/helpers/is-empty';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { getEmployeeById } from 'redux/employee/actions';
import { selectisLoading, selectEmployee } from 'redux/employee/selectors';
import { getRemunerationById } from 'redux/payroll/actions';
import {
	selectSingleRemuneration,
	selectisLoading as selectRemunerationLoading,
} from 'redux/payroll/selectors';
import { useMount } from 'broad-state';
import { useParams } from 'react-router-dom';
import Loader from 'components/loader';
import { TableWrap } from 'components/layout/dashboard-layout';
import { getTrueKeys, formatAmount } from 'utils';
import { DashboardSubWrapper } from '../../company-structure';
import PayslipBreakdownDetail from './payslip-detail';

const EmployeeDetail = ({
	isLoading,
	employee,
	getEmployeeById,
	getRemunerationById,
	isRemunerationLoading,
	remuneration,
}) => {
	const { id: employeeId } = useParams();
	useMount(() => {
		getEmployeeById(employeeId);
	});
	useEffect(() => {
		if (employee?.remuneration) {
			getRemunerationById(employee.remuneration?.id);
		}
		// eslint-disable-next-line
	}, []);
	return (
		<>
			<NavLayout title="Employee Detail" />
			<DashboardSubWrapper className="wrapper-contain">
				<h4 className="page-main-title">
					{employee?.first_name} {employee?.last_name}
				</h4>
				<SectionHeadsnItems className="main-table-wrapper">
					<FormWrapper>
						<FormContent>
							<div className="row">
								<div className="col-md-12">
									{isLoading &&
									isRemunerationLoading &&
									!isEmpty(remuneration) &&
									!isEmpty(employee) ? (
										<Loader loadingText="Fetching Employee" />
									) : (
										<Formik initialValues={{}} enableReinitialize>
											{(props) => (
												<div className="row">
													<div className="col-sm-7">
														<PayslipLeaveWrapper>
															{employee?.id && <PayslipBreakdownDetail />}
															<p>Leave History</p>
															<TableWrap>
																{' '}
																{!isLoading ? (
																	<Table responsive bordered>
																		{!isLoading &&
																		!isEmpty(employee?.leave_applications) ? (
																			<>
																				<thead>
																					<tr>
																						<th>Leave</th>
																						<th>Number of Days</th>
																						<th>Date</th>
																						<th>Status</th>
																					</tr>
																				</thead>
																				<tbody>
																					{employee?.leave_applications?.map(
																						(leave, index) => (
																							<tr key={leave.id}>
																								<td>{leave.leave.name}</td>
																								<td>{leave.number_of_days}</td>
																								<td>
																									{leave.start_date} -{' '}
																									{leave.end_date}
																								</td>
																								<td>
																									<span
																										className={`status-${
																											leave?.is_active
																												? 'active'
																												: 'inactive'
																										}`}
																									>
																										{leave.is_active
																											? 'Active'
																											: 'Past'}
																									</span>
																								</td>
																							</tr>
																						)
																					)}
																				</tbody>
																			</>
																		) : (
																			<p className="text-center mx-auto mt-5 no-data">
																				No Available Leaves yet
																			</p>
																		)}
																	</Table>
																) : (
																	<Loader loadingText="Getting Leave Applications History" />
																)}
															</TableWrap>{' '}
														</PayslipLeaveWrapper>
													</div>
													<div className="col-sm-5">
														<DetailsWrapper>
															<h4>Details</h4>
															<ListWrapper>
																<LabelText>Title</LabelText>
																<DetailText>{employee?.title}</DetailText>
															</ListWrapper>
															<ListWrapper>
																<LabelText>First Name</LabelText>
																<DetailText>{employee?.first_name}</DetailText>
															</ListWrapper>
															<ListWrapper>
																<LabelText>Last Name</LabelText>
																<DetailText>{employee?.last_name}</DetailText>
															</ListWrapper>
															<ListWrapper>
																<LabelText>Other Name</LabelText>
																<DetailText>{employee?.other_name}</DetailText>
															</ListWrapper>
															<ListWrapper>
																<LabelText>Personal Email</LabelText>
																<DetailText>
																	{employee?.personal_email}
																</DetailText>
															</ListWrapper>
															<ListWrapper>
																<LabelText>Marital Status</LabelText>
																<DetailText>
																	{employee?.marital_status}
																</DetailText>
															</ListWrapper>
															<ListWrapper>
																<LabelText>Gender</LabelText>
																<DetailText>{employee?.gender}</DetailText>
															</ListWrapper>
															<ListWrapper>
																<LabelText>Date of birth</LabelText>
																<DetailText>
																	{moment(employee.date_of_birth).format(
																		'YYYY-MM-DD'
																	)}
																</DetailText>
															</ListWrapper>
															<ListWrapper>
																<LabelText>Nationality</LabelText>
																<DetailText>{employee?.nationality}</DetailText>
															</ListWrapper>
															<ListWrapper>
																<LabelText>Phone Number</LabelText>
																<DetailText>
																	{employee?.phone_number}
																</DetailText>
															</ListWrapper>
															<ListWrapper>
																<LabelText>Next of Kin name</LabelText>
																<DetailText>
																	{employee?.next_of_kin_name}
																</DetailText>
															</ListWrapper>
															<ListWrapper>
																<LabelText>Next of Kin Email</LabelText>
																<DetailText>
																	{employee?.next_of_kin_email}
																</DetailText>
															</ListWrapper>
															<ListWrapper>
																<LabelText>Next of Kin Phone Number</LabelText>
																<DetailText>
																	{employee?.next_of_kin_phone_number}
																</DetailText>
															</ListWrapper>
															<HR />
															<ListWrapper>
																<LabelText>Employee Code</LabelText>
																<DetailText>
																	{employee.employee_code}
																</DetailText>
															</ListWrapper>
															<ListWrapper>
																<LabelText>Pension Start Date</LabelText>
																<DetailText>
																	{moment(employee.pension_start_date).format(
																		'YYYY-MM-DD'
																	)}
																</DetailText>
															</ListWrapper>
															<ListWrapper>
																<LabelText>Date Engaged</LabelText>
																<DetailText>
																	{moment(employee.date_engaged).format(
																		'YYYY-MM-DD'
																	)}
																</DetailText>
															</ListWrapper>
															<ListWrapper>
																<LabelText>Probation Period</LabelText>
																<DetailText>
																	{employee.probation_period}
																</DetailText>
															</ListWrapper>
															<ListWrapper>
																<LabelText>Probation Period</LabelText>
																<DetailText>
																	{employee.probation_period}
																</DetailText>
															</ListWrapper>
															<ListWrapper>
																<LabelText>Pension PIN</LabelText>
																<DetailText>{employee.pension_pin}</DetailText>
															</ListWrapper>
															<ListWrapper>
																<LabelText>Tax. Number</LabelText>
																<DetailText>
																	{employee.tax_identification_number}
																</DetailText>
															</ListWrapper>
															<ListWrapper>
																<LabelText>NHF</LabelText>
																<DetailText>{employee.nhf}</DetailText>
															</ListWrapper>
															<ListWrapper>
																<LabelText>Job Title</LabelText>
																<DetailText>
																	{employee.job_title?.name}
																</DetailText>
															</ListWrapper>
															<ListWrapper>
																<LabelText>Nature of Contract</LabelText>
																<DetailText>
																	{employee.nature_of_contract?.name}
																</DetailText>
															</ListWrapper>
															<ListWrapper>
																<LabelText>Job Grade</LabelText>
																<DetailText>
																	{employee.job_grade?.name}
																</DetailText>
															</ListWrapper>
															<ListWrapper>
																<LabelText>Department</LabelText>
																<DetailText>
																	{employee?.hierarchy
																		?.map((data) => data.name)
																		?.join(', ')}
																</DetailText>
															</ListWrapper>
															<ListWrapper>
																<LabelText>Leaves</LabelText>
																<DetailText>
																	{employee?.leaves
																		?.map((data) => data.name)
																		?.join(', ')}
																</DetailText>
															</ListWrapper>
															<ListWrapper>
																<LabelText>Tax Relief Group</LabelText>
																<DetailText>
																	{employee?.tax_relief?.name}
																</DetailText>
															</ListWrapper>
															<HR />
															<ListWrapper>
																<LabelText>Bank Name</LabelText>
																<DetailText>{employee.bank?.name}</DetailText>
															</ListWrapper>
															<ListWrapper>
																<LabelText>Account Name</LabelText>
																<DetailText>{employee.account_name}</DetailText>
															</ListWrapper>
															<ListWrapper>
																<LabelText>Account Number</LabelText>
																<DetailText>
																	{employee.account_number}
																</DetailText>
															</ListWrapper>
															<ListWrapper>
																<LabelText>Remuneration Structure</LabelText>
																<DetailText>
																	{employee.remuneration?.name}
																</DetailText>
															</ListWrapper>
															<ListWrapper>
																<LabelText>Monthly Salary</LabelText>
																<DetailText>
																	{formatAmount(employee.rates_per_month)}
																</DetailText>
															</ListWrapper>
															<ListWrapper>
																<LabelText>Annual Salary</LabelText>
																<DetailText>
																	{formatAmount(employee.rates_per_year)}
																</DetailText>
															</ListWrapper>
															<HR />
															<ListWrapper>
																<LabelText>Hours Per day</LabelText>
																<DetailText>
																	{employee.hours_per_day}
																</DetailText>
															</ListWrapper>
															<ListWrapper>
																<LabelText>Hours Per Week</LabelText>
																<DetailText>
																	{employee.hours_per_week}
																</DetailText>
															</ListWrapper>
															<ListWrapper>
																<LabelText>Hours Per Month</LabelText>
																<DetailText>
																	{employee.hours_per_month}
																</DetailText>
															</ListWrapper>
															<ListWrapper>
																<LabelText>Workdays</LabelText>
																<DetailText>
																	{getTrueKeys({
																		M: employee?.works_monday,
																		T: employee?.works_tuesday,
																		W: employee?.works_wednesday,
																		Thr: employee?.works_thursday,
																		F: employee?.works_friday,
																		Sat: employee?.works_saturday,
																		Sun: employee?.works_sunday,
																	}).toString()}
																</DetailText>
															</ListWrapper>
														</DetailsWrapper>
													</div>
												</div>
											)}
										</Formik>
									)}
								</div>
							</div>
						</FormContent>
					</FormWrapper>
				</SectionHeadsnItems>
			</DashboardSubWrapper>
		</>
	);
};

const SectionHeadsnItems = styled.div`
	justify-content: center;
	padding: 1rem;
`;

const FormWrapper = styled.div`
	margin-top: 1rem;
`;

const FormContent = styled.div`
	// width: 90%;
	// margin: 0 auto;
`;

const DetailsWrapper = styled.div`
	overflow-y: auto;
	height: 100%;
	padding: 20px 15px;
	border-left: 1px solid rgb(224, 224, 224);
`;

const PayslipLeaveWrapper = styled.div`
	overflow-y: auto;
	height: 100%;
	padding: 20px 15px;
`;

const ListWrapper = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
`;

const LabelText = styled.p`
	font-size: 14px;
`;

const DetailText = styled.p`
	font-size: 14px;
	font-weight: 700;
`;

const HR = styled.hr`
	border: 1px solid #fff;
`;

const mapStateToProps = createStructuredSelector({
	isLoading: selectisLoading,
	employee: selectEmployee,
	isRemunerationLoading: selectRemunerationLoading,
	remuneration: selectSingleRemuneration,
});
export default connect(mapStateToProps, {
	getEmployeeById,
	getRemunerationById,
})(EmployeeDetail);
