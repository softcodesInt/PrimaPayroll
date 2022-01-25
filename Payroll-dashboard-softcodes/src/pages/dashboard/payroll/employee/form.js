import React, { useState } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { Formik, Field, Form, FieldArray } from 'formik';
import { ErrorText } from 'components/input';

const EmployeeDrivenForm = ({
	data,
	addEmployeeDrivenPayroll,
	employeeId,
	initialValues,
}) => {
	const [error, setError] = useState();
	console.log(initialValues);
	return (
		<div>
			<Formik
				initialValues={initialValues}
				validate={() => ({ foo: true })}
				onSubmit={(values) => {
					alert(JSON.stringify(values, null, 2));
				}}
				render={({ values, errors, touched, handleReset }) => {
					return (
						<Form>
							<FieldArray
								name="payrollLines"
								render={({ insert, remove, push }) => (
									<div className="col-md-12">
										{data &&
											data?.map((element, index) => (
												<div className="row" key={index}>
													<div className="col-sm-3 offset-sm-1">
														<span>Name</span>
														<Field
															name={`payrollLines.${index}.id`}
															as="select"
															className="form-control mb-4"
															disabled
														>
															<option value="red">Select Payroll line</option>
															{data.map((d) => (
																<option value={d.id}>{d.name}</option>
															))}
														</Field>
														{errors.payrollLines &&
															errors.payrollLines[index] &&
															errors.payrollLines[index].id &&
															touched.payrollLines &&
															touched.payrollLines[index].id && (
																<div className="field-error">
																	{errors.payrollLines[index].id}
																</div>
															)}
													</div>
													<div className="col-sm-2">
														{console.log(data, index)}
														<span>Amount</span>
														<Field
															name={`payrollLines.${index}.calculation_type_value`}
															placeholder="Amount e.g 40000"
															type="text"
															className="form-control mb-4"
														/>
														{errors.payrollLines &&
															errors.payrollLines[index] &&
															errors.payrollLines[index]
																.calculation_type_value &&
															touched.payrollLines &&
															touched.payrollLines[index]
																.calculation_type_value && (
																<div className="field-error">
																	{
																		errors.payrollLines[index]
																			.calculation_type_value
																	}
																</div>
															)}
													</div>
												</div>
											))}
										<div className="col-sm-8 offset-sm-2">
											{error && <ErrorText>{error}</ErrorText>}
										</div>
									</div>
								)}
							/>
							<div className="row">
								<ButtonGroup className="col-sm-4 offset-sm-2 mb-5">
									<Button
										type="submit"
										variant="primary"
										onClick={(e) => {
											setError();
											e.preventDefault();
											console.log(values);
											addEmployeeDrivenPayroll(employeeId, values);
										}}
									>
										Save
									</Button>
								</ButtonGroup>
							</div>
						</Form>
					);
				}}
			/>
		</div>
	);
};

export default EmployeeDrivenForm;
