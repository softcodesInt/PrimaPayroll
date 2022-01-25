import React, { useState } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { Formik, Field, Form, FieldArray } from 'formik';
import { ErrorText } from 'components/input';

const getElement = (elements, value) => {
	return elements.filter((e) => e.name === value)[0];
};

const validateTransactionsData = (values, choices) => {
	const earnings = [];
	const earnings_name = [];
	const deductions = [];
	const deductions_name = [];
	// eslint-disable-next-line
	values.map((value) => {
		const currentElement = getElement(choices, value.name);
		if (currentElement.element_type === 'DEDUCTIONS') {
			if (deductions_name.includes(currentElement.name)) {
				throw Error(`${currentElement.name} was selected more than once.`);
			}
			deductions_name.push(currentElement.name);
			deductions.push({
				name: currentElement.name,
				amount: value.amount,
			});
		} else {
			if (earnings_name.includes(currentElement.name)) {
				throw Error(`${currentElement.name} was selected more than once.`);
			}
			earnings_name.push(currentElement.name);
			earnings.push({
				name: currentElement.name,
				amount: value.amount,
			});
		}
	});
	return {
		earnings,
		deductions,
	};
};

const TransactionForm = ({
	initialValues,
	addEmployeeTransaction,
	employeeId,
	activeId,
	elements,
}) => {
	const [error, setError] = useState();
	console.log(activeId);
	const saveTransaction = (data) => {
		addEmployeeTransaction(employeeId, data, activeId);
	};
	const formatTransactionPayload = (values, choices) => {
		try {
			const data = validateTransactionsData(values, choices);
			saveTransaction(data);
		} catch (e) {
			setError(e.message);
		}
	};

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
								name="transactions"
								render={({ insert, remove, push }) => (
									<div>
										{elements &&
											elements.map((element, index) => (
												<div className="row" key={index}>
													<div className="col-sm-4 offset-sm-2">
														<span>Name</span>
														<Field
															name={`transactions.${index}.name`}
															as="select"
															className="form-control mb-4"
														>
															<option value="red">....</option>
															{elements.map((data) => (
																<option value={data.name}>
																	{data.name}-{data.element_type}
																</option>
															))}
														</Field>
														{errors.transactions &&
															errors.transactions[index] &&
															errors.transactions[index].name &&
															touched.transactions &&
															touched.transactions[index].name && (
																<div className="field-error">
																	{errors.transactions[index].name}
																</div>
															)}
													</div>
													<div className="col-sm-4">
														<span>Amount</span>
														<Field
															name={`transactions.${index}.amount`}
															placeholder="Amount e.g 40000"
															type="text"
															className="form-control mb-4"
														/>
														{errors.transactions &&
															errors.transactions[index] &&
															errors.transactions[index].amount &&
															touched.transactions &&
															touched.transactions[index].amount && (
																<div className="field-error">
																	{errors.transactions[index].amount}
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
										onClick={(event) => {
											event.preventDefault();
											setError();
											handleReset();
										}}
										variant="secondary"
										className="mr-3"
									>
										Reset
									</Button>
									<Button
										type="submit"
										variant="primary"
										onClick={(e) => {
											setError();
											e.preventDefault();
											formatTransactionPayload(values.transactions, elements);
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

export default TransactionForm;
