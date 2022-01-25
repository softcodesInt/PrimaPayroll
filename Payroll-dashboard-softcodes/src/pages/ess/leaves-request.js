import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Select from 'components/select';
import Button from 'components/button';
import Input from 'components/input';
import { Formik } from 'formik';
import { isEmpty } from 'codewonders-helpers';
import { Table } from 'react-bootstrap';

import { DashboardSubWrapper } from 'pages/dashboard/company-structure';
import { selectAuthUser, selectisLoading } from 'redux/user/selectors';
import NavLayout from 'components/layout/dashboard-layout/navbar';
import { TableWrap } from 'components/layout/dashboard-layout';
import { essLeaveWorkflowSchema } from 'utils/validation-schema';
import { saveLeaveWorkflow } from 'redux/leave/actions';
import { selectEmployeeWorkflowLoading } from 'redux/leave/selectors';

const LeaveRequest = ({ user, isSavingLoading, saveLeaveWorkflow }) => {
	return (
		<>
			<NavLayout title="My Details" isBack />
			<DashboardSubWrapper className="wrapper-contain ml-5 mr-5">
				<h4 className="page-main-title">Leaves Request</h4>

				<div className="row">
					<div className="card main-table-wrapper">
						<div className="card-body">
							<p className="summary-title">Available leaves</p>
							<TableWrap>
								<Table responsive bordered>
									{!isEmpty(user?.employee_leaves) ? (
										<>
											<thead>
												<tr>
													<th>S/N</th>
													<th>Name</th>
													<th>Days Available</th>
												</tr>
											</thead>
											<tbody>
												{user.employee_leaves?.map((leave, index) => (
													<tr>
														<td>{index + 1}</td>
														<td>{leave.name}</td>
														<td>{leave.days_left}</td>
													</tr>
												))}
											</tbody>
										</>
									) : (
										<p className="text-center mx-auto mt-5 no-data">
											No Available Leaves yet
										</p>
									)}
								</Table>
							</TableWrap>{' '}
							<Formik
								initialValues={{
									leave: '',
									number_of_days: '',
									start_date: '',
								}}
								onSubmit={(values) => {
									saveLeaveWorkflow(user?.id, values, true);
								}}
								validationSchema={essLeaveWorkflowSchema}
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
									<div className="row mt-4">
										<div className="col-md-12">
											<div className="row">
												<div className="col-md-4">
													<Select
														hasStrip
														id="leave"
														name="leave"
														label="Leave*"
														value={values.leave}
														onChange={handleChange}
														onBlur={handleBlur}
														errorMessage={errors.leave}
														isInvalid={errors.leave && touched.leave}
													>
														<option>--Choose a leave--</option>
														<>
															{user?.employee_leaves?.map((leave) => (
																<option value={leave.id} key={leave.id}>
																	{leave.name}
																</option>
															))}
														</>
													</Select>
												</div>
												<div className="col-md-4">
													<Input
														hasStrip
														id="number_of_days"
														name="number_of_days"
														type="number"
														label="Number of days*"
														placeholder="How many days is the user going to be on leave?"
														value={values.number_of_days}
														onChange={handleChange}
														onBlur={handleBlur}
														errorMessage={errors.number_of_days}
														isInvalid={
															errors.number_of_days && touched.number_of_days
														}
													/>
												</div>
												<div className="col-md-4">
													<Input
														hasStrip
														id="start_date"
														name="start_date"
														type="date"
														format="yyyy-mm-dd"
														label="Start Date of leave*"
														placeholder="yyyy-mm-dd"
														value={values.start_date}
														onChange={handleChange}
														onBlur={handleBlur}
														errorMessage={errors.start_date}
														isInvalid={errors.start_date && touched.start_date}
													/>
													<Button
														type="submit"
														className="btn-soft mt-4"
														isLoading={isSavingLoading}
														disabled={isSavingLoading}
														onClick={handleSubmit}
													>
														Submit
													</Button>
												</div>
											</div>
										</div>
									</div>
								)}
							</Formik>
						</div>
					</div>
				</div>
			</DashboardSubWrapper>
		</>
	);
};

const mapStateToProps = createStructuredSelector({
	isLoading: selectisLoading,
	user: selectAuthUser,
	isSavingLoading: selectEmployeeWorkflowLoading,
});

export default connect(mapStateToProps, { saveLeaveWorkflow })(LeaveRequest);
