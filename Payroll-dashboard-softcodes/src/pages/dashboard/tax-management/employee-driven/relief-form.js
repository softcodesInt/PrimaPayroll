import React, { useState } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { Formik, Field, Form, FieldArray } from 'formik';
import { ErrorText } from 'components/input';

const ReliefForm = ({
	initialValues,
	addEmployeeRelief,
	employeeId,
	elements,
}) => {
	const [error, setError] = useState();
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
								name="relief"
								render={({ insert, remove, push }) => (
									<div>
										{elements &&
											elements.tax_relief &&
											elements.tax_relief?.map((element, index) => (
												<div className="row" key={index}>
													<div className="col-sm-3 offset-sm-1">
														<span>Name</span>
														<Field
															name={`relief.${index}.id`}
															as="select"
															className="form-control mb-4"
															disabled
														>
															<option value="red">Select Relief</option>
															{elements.tax_relief.map((data) => (
																<option value={data.tax_relief.id}>
																	{data.tax_relief.name}
																</option>
															))}
														</Field>
														{errors.relief &&
															errors.relief[index] &&
															errors.relief[index].id &&
															touched.relief &&
															touched.relief[index].id && (
																<div className="field-error">
																	{errors.relief[index].id}
																</div>
															)}
													</div>
													<div className="col-sm-2">
														<span>Amount</span>
														<Field
															name={`relief.${index}.amount`}
															placeholder="Amount e.g 40000"
															type="text"
															className="form-control mb-4"
														/>
														{errors.relief &&
															errors.relief[index] &&
															errors.relief[index].amount &&
															touched.relief &&
															touched.relief[index].amount && (
																<div className="field-error">
																	{errors.relief[index].amount}
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
											addEmployeeRelief(employeeId, values);
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

export default ReliefForm;
