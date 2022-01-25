/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React from 'react';
import styled from 'styled-components';
import { Formik } from 'formik';
import { isEmpty } from 'codewonders-helpers';
/* -------------------------- Internal Dependencies ------------------------- */
import NavLayout from 'components/layout/dashboard-layout/navbar';
import Button from 'components/button';
import Input from 'components/input';

/* --------------------------- Image Dependencies --------------------------- */
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
	selectPensionSetting,
	selectisLoading,
} from 'redux/settings/selectors';
import { selectAllPayroll } from 'redux/payroll/selectors';
import { getAllPayrolls } from 'redux/payroll/actions';
import { addPensionSetting, getPensionSetting } from 'redux/settings/actions';
import { useMount } from 'broad-state';
import { MultiSelect } from 'components/select';
import { DashboardSubWrapper } from '../../company-structure';

const PensionSetting = ({
	isLoading,
	addPensionSetting,
	getPensionSetting,
	pension,
	getAllPayrolls,
	payroll_data,
}) => {
	useMount(() => {
		getPensionSetting();
		getAllPayrolls('', 1, null, '');
	});
	console.log(pension);

	const initialValues = {
		id: pension.id,
		employee_rate: pension.employee_rate,
		employer_rate: pension.employer_rate,
		payroll_lines: pension?.payroll_lines?.map((value) => {
			return {
				label: value.name,
				value: value.id,
			};
		}),
	};

	const getSelectDropdown = (data) => {
		if (!isEmpty(data?.results)) {
			return data.results.map((value) => {
				return {
					value: value.id,
					label: value.name,
				};
			});
		}
		return [];
	};
	return (
		<>
			<NavLayout title="Pension Setting" />
			<DashboardSubWrapper className="wrapper-contain">
				<h4 className="page-main-title">Setup Pension</h4>
				<SectionHeadsnItems className="main-table-wrapper">
					<FormWrapper>
						<FormContent>
							<div className="row mr-10">
								<div className="col-md-6">
									<p>Define the employer/employee quota</p>
									<Formik
										enableReinitialize
										initialValues={initialValues}
										onSubmit={async (
											{ id, employee_rate, employer_rate, payroll_lines },
											resetForm
										) => {
											console.log(payroll_lines);
											try {
												const data = {
													employee_rate,
													employer_rate,
													payroll_lines: payroll_lines.map(
														(item) => item.value || item.id
													),
												};
												if (id) {
													data.id = id;
												}
												await addPensionSetting({ ...data });
											} catch (e) {}
										}}
									>
										{({
											values,
											handleChange,
											handleBlur,
											errors,
											touched,
											handleSubmit,
											setFieldValue,
											setFieldTouched,
										}) => (
											<form onSubmit={handleSubmit}>
												<div className="row">
													<div className="col-md-12">
														<Input
															hasStrip
															id="employee_rate"
															name="employee_rate"
															type="text"
															label="Employee Setting"
															placeholder="Enter employee quota"
															value={values.employee_rate}
															onChange={handleChange}
															onBlur={handleBlur}
															errorMessage={errors.employee_rate}
															isInvalid={
																errors.employee_rate && touched.employee_rate
															}
														/>
													</div>
													<div className="col-md-12">
														<Input
															hasStrip
															id="employer_rate"
															name="employer_rate"
															type="text"
															label="Employer Setting"
															placeholder="Enter employer quota"
															value={values.employer_rate}
															onChange={handleChange}
															onBlur={handleBlur}
															errorMessage={errors.employer_rate}
															isInvalid={
																errors.employer_rate && touched.employer_rate
															}
														/>
													</div>
													<div className="col-md-6">
														<MultiSelect
															label="Payroll Elements"
															placeholder="Select payroll elements"
															options={getSelectDropdown(payroll_data)}
															onChange={(value) => {
																console.log(values);
																setFieldValue('payroll_lines', value);
																setFieldTouched('payroll_lines', true);
															}}
															value={values.payroll_lines}
															name="payroll_lines"
														/>
													</div>
												</div>
												<Button
													type="submit"
													className="btn-soft mr-auto mt-4"
													isLoading={isLoading}
													disabled={isLoading}
												>
													Save Changes
												</Button>
											</form>
										)}
									</Formik>
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
	margin-top: 1rem;
	background: #ffffff;
	justify-content: center;
	padding: 2rem;
`;

const FormWrapper = styled.div`
	margin-top: 1rem;
`;

const FormContent = styled.div`
	width: 80%;
	margin: 0 auto;
`;

const mapStateToProps = createStructuredSelector({
	isLoading: selectisLoading,
	pension: selectPensionSetting,
	payroll_data: selectAllPayroll,
});
export default connect(mapStateToProps, {
	addPensionSetting,
	getPensionSetting,
	getAllPayrolls,
})(PensionSetting);
