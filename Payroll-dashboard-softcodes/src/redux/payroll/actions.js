/* -------------------------- Internal Dependencies ------------------------- */

import { setAlert } from 'redux/alert/actions';
import API from 'services/api';
import { capitalize, getError } from 'utils';
import history from 'utils/history';
import { token } from 'utils/user_persist';
import PayrollStructureActions from './types';

/**
 * @namespace dispatch
 */

/**
 * Activate License
 * @function
 * @param {Object} data
 * @returns {Function}
 */
export const addPayroll = (data) => {
	return async (dispatch) => {
		dispatch({
			type: PayrollStructureActions.ADD_PAYROLL,
			payload: {
				loading: true,
			},
		});
		const options = API.options('POST', token, { data });

		try {
			await API.request('/payroll/element/', options);

			dispatch({
				type: PayrollStructureActions.ADD_PAYROLL,
				payload: {
					loading: false,
				},
			});

			dispatch(getAllPayrolls('', 1, '', data?.element_type));
			return dispatch(
				setAlert(
					`${capitalize(
						data?.element_type?.replace(/[^a-zA-Z ]/g, ' ')
					)} added successfully.`,
					'success'
				)
			);
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: PayrollStructureActions.ADD_PAYROLL,
				payload: {
					loading: false,
				},
			});
			throw err;
		}
	};
};
/**
 * Activate License
 * @function
 * @param {Object} data
 * @returns {Function}
 */
export const addCategory = (data) => {
	return async (dispatch) => {
		dispatch({
			type: PayrollStructureActions.ADD_CATEGORY,
			payload: {
				loading: true,
			},
		});
		const options = API.options('POST', token, { data });

		try {
			await API.request('/payroll/category/', options);

			dispatch({
				type: PayrollStructureActions.ADD_CATEGORY,
				payload: {
					loading: false,
				},
			});

			dispatch(getAllPayrollCategory());

			return dispatch(setAlert(`Payroll Group added successfully.`, 'success'));
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: PayrollStructureActions.ADD_CATEGORY,
				payload: {
					loading: false,
				},
			});
			throw err;
		}
	};
};

/**
 * Activate License
 * @function
 * @param {Object} data
 * @returns {Function}
 */
export const editPayroll = (id, data) => {
	return async (dispatch) => {
		dispatch({
			type: PayrollStructureActions.EDIT_PAYROLL,
			payload: {
				loading: true,
			},
		});
		const options = API.options('PATCH', token, { data });

		try {
			await API.request(`/payroll/element/${id}/`, options);

			dispatch({
				type: PayrollStructureActions.EDIT_PAYROLL,
				payload: {
					loading: false,
				},
			});

			dispatch(
				setAlert(
					`${capitalize(
						data?.element_type?.replace(/[^a-zA-Z ]/g, ' ')
					)} updated successfully.`,
					'success'
				)
			);

			return Promise.all([
				dispatch(getAllPayrolls('', 1, '', data?.element_type)),
			]);
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: PayrollStructureActions.EDIT_PAYROLL,
				payload: {
					loading: false,
				},
			});
			throw err;
		}
	};
};
/**
 * Activate License
 * @function
 * @param {Object} data
 * @returns {Function}
 */
export const editCategory = (id, data, isViewHead) => {
	return async (dispatch) => {
		dispatch({
			type: PayrollStructureActions.EDIT_CATEGORY,
			payload: {
				loading: true,
			},
		});
		const options = API.options('PATCH', token, { data });

		try {
			await API.request(`/payroll/category/${id}/`, options);

			dispatch({
				type: PayrollStructureActions.EDIT_CATEGORY,
				payload: {
					loading: false,
				},
			});

			dispatch(setAlert(`Payroll Group updated successfully.`, 'success'));
			if (isViewHead !== undefined) {
				return dispatch(getPayrollById(id));
			}
			return Promise.all([dispatch(getAllPayrollCategory())]);
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: PayrollStructureActions.EDIT_CATEGORY,
				payload: {
					loading: false,
				},
			});
			throw err;
		}
	};
};

/**
 * @function
 * @param { user_id } Id // Get userId from state
 */
export const getPayrollById = (Id) => {
	return async (dispatch) => {
		dispatch({
			type: PayrollStructureActions.GET_BY_ID,
			payload: { loading: true },
		});
		const options = API.options('GET', token, {});
		try {
			const response = await API.request(`/payroll/element/${Id}/`, options);

			await dispatch({
				type: PayrollStructureActions.GET_BY_ID,
				payload: { loading: false, data: response.data },
			});

			return response.data;
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: PayrollStructureActions.GET_BY_ID,
				payload: { loading: false },
			});
		}
	};
};
/**
 * @function
 * @param { user_id } Id // Get userId from state
 */
export const getAllPayrolls = (search = '', page = 1, url, type) => {
	return async (dispatch) => {
		dispatch({
			type: PayrollStructureActions.GET_PAYROLL,
			payload: { loading: true },
		});
		const options = API.options('GET', token, {});
		try {
			const response = !url
				? await API.request(
						`/payroll/element/?element_type=${type}&page=${page}&search=${search}`,
						options
				  )
				: await API.request(url, options, true);

			await dispatch({
				type: PayrollStructureActions.GET_PAYROLL,
				payload: {
					loading: false,
					data: {
						current_page: page || url.split('?')[0].replace('page=', ''),
						...response.data,
					},
				},
			});

			return response.data;
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: PayrollStructureActions.GET_PAYROLL,
				payload: { loading: false },
			});
		}
	};
};
/**
 * @function
 * @param { user_id } Id // Get userId from state
 */
export const getAllPayrollCategory = (search = '', page = 1, url) => {
	return async (dispatch) => {
		dispatch({
			type: PayrollStructureActions.GET_CATEGORY,
			payload: { loading: true },
		});
		const options = API.options('GET', token, {});
		try {
			const response = !url
				? await API.request(
						`/payroll/category/?page=${page}&search=${search}`,
						options
				  )
				: await API.request(url, options, true);

			await dispatch({
				type: PayrollStructureActions.GET_CATEGORY,
				payload: {
					loading: false,
					data: {
						current_page: page || url.split('?')[0].replace('page=', ''),
						...response.data,
					},
				},
			});

			return response.data;
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: PayrollStructureActions.GET_CATEGORY,
				payload: { loading: false },
			});
		}
	};
};
/**
 * @function
 * @param { user_id } Id // Get userId from state
 */
export const deactivatePayroll = (Id, type) => {
	return async (dispatch) => {
		dispatch({
			type: PayrollStructureActions.DEACTIVATE_PAYROLL,
			payload: { loading: true },
		});
		const options = API.options('DELETE', token, {});
		try {
			await API.request(`/payroll/element/${Id}/`, options);

			await dispatch({
				type: PayrollStructureActions.DEACTIVATE_PAYROLL,
				payload: { loading: false },
			});

			await dispatch(getAllPayrolls('', 1, '', type));

			return dispatch(setAlert(`Payroll deactivated successfully`, 'success'));
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: PayrollStructureActions.DEACTIVATE_PAYROLL,
				payload: { loading: false },
			});
		}
	};
};
/**
 * @function
 * @param { user_id } Id // Get userId from state
 */
export const deactivateCategory = (Id, isReRoute) => {
	return async (dispatch) => {
		dispatch({
			type: PayrollStructureActions.DEACTIVATE_CATEGORY,
			payload: { loading: true },
		});
		const options = API.options('DELETE', token, {});
		try {
			await API.request(`/payroll/category/${Id}/`, options);

			await dispatch({
				type: PayrollStructureActions.DEACTIVATE_CATEGORY,
				payload: { loading: false },
			});

			if (isReRoute) {
				return history.push('/dashboard/leaves');
			}
			await dispatch(getAllPayrollCategory());
			dispatch(setAlert(`Payroll Group deactivated successfully`, 'success'));
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: PayrollStructureActions.DEACTIVATE_CATEGORY,
				payload: { loading: false },
			});
		}
	};
};

export const addRemuneration = (data) => {
	return async (dispatch) => {
		dispatch({
			type: PayrollStructureActions.ADD_PAYROLL,
			payload: {
				loading: true,
			},
		});
		const options = API.options('POST', token, { data });

		try {
			await API.request('/payroll/remuneration/', options);

			dispatch({
				type: PayrollStructureActions.ADD_PAYROLL,
				payload: {
					loading: false,
				},
			});

			dispatch(getAllPayrollCategory());

			return dispatch(setAlert(`Remuneration added successfully.`, 'success'));
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: PayrollStructureActions.ADD_PAYROLL,
				payload: {
					loading: false,
				},
			});
			throw err;
		}
	};
};

export const editRemuneration = (id, data, isViewHead) => {
	return async (dispatch) => {
		dispatch({
			type: PayrollStructureActions.EDIT_PAYROLL,
			payload: {
				loading: true,
			},
		});
		const options = API.options('PATCH', token, { data });

		try {
			await API.request(`/payroll/remuneration/${id}/`, options);

			dispatch({
				type: PayrollStructureActions.EDIT_PAYROLL,
				payload: {
					loading: false,
				},
			});

			dispatch(setAlert(`Remuneration updated successfully.`, 'success'));
			if (isViewHead !== undefined) {
				return dispatch(getPayrollById(id));
			}
			return Promise.all([dispatch(getAllPayrollCategory())]);
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: PayrollStructureActions.EDIT_PAYROLL,
				payload: {
					loading: false,
				},
			});
			throw err;
		}
	};
};

export const getAllRemuneration = (
	search = '',
	page = 1,
	queryParam = '',
	url
) => {
	return async (dispatch) => {
		dispatch({
			type: PayrollStructureActions.GET_REMUNERATION,
			payload: { loading: true },
		});
		const options = API.options('GET', token, {});
		try {
			let api_url = '';
			if (url) {
				api_url = url;
			}
			if (queryParam) {
				api_url = `/payroll/remuneration/?${queryParam}`;
			} else {
				api_url = `/payroll/remuneration/?page=${page}&search=${search}`;
			}
			const response = !url
				? await API.request(api_url, options)
				: await API.request(url, options, true);

			await dispatch({
				type: PayrollStructureActions.GET_REMUNERATION,
				payload: {
					loading: false,
					data: {
						current_page: page || api_url.split('?')[0].replace('page=', ''),
						...response.data,
					},
				},
			});

			return response.data;
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: PayrollStructureActions.GET_REMUNERATION,
				payload: { loading: false },
			});
		}
	};
};

export const deactivateRemuneration = (Id, isReRoute) => {
	return async (dispatch) => {
		dispatch({
			type: PayrollStructureActions.DEACTIVATE_PAYROLL,
			payload: { loading: true },
		});
		const options = API.options('DELETE', token, {});
		try {
			await API.request(`/payroll/remuneration/${Id}/`, options);

			await dispatch({
				type: PayrollStructureActions.DEACTIVATE_PAYROLL,
				payload: { loading: false },
			});

			await dispatch(getAllRemuneration());
			dispatch(setAlert(`Remunueration deactivated successfully`, 'success'));
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: PayrollStructureActions.DEACTIVATE_PAYROLL,
				payload: { loading: false },
			});
		}
	};
};

export const getRemunerationById = (Id) => {
	return async (dispatch) => {
		dispatch({
			type: PayrollStructureActions.GET_REMUNERATION_BY_ID,
			payload: { loading: true },
		});
		const options = API.options('GET', token, {});
		try {
			const response = await API.request(
				`/payroll/remuneration/${Id}/`,
				options
			);

			await dispatch({
				type: PayrollStructureActions.GET_REMUNERATION_BY_ID,
				payload: { loading: false, data: response.data },
			});

			return response.data;
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: PayrollStructureActions.GET_REMUNERATION_BY_ID,
				payload: { loading: false },
			});
		}
	};
};

export const getPayPeriod = (policyId) => {
	return async (dispatch) => {
		dispatch({
			type: PayrollStructureActions.GET_PAY_PERIOD,
			payload: { loading: true },
		});
		const options = API.options('GET', token, {});
		try {
			const response = await API.request(
				`/payroll/pay-period/${policyId}/`,
				options
			);
			await dispatch({
				type: PayrollStructureActions.GET_PAY_PERIOD,
				payload: { loading: false, data: response.data },
			});

			return response.data;
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: PayrollStructureActions.GET_REMUNERATION_BY_ID,
				payload: { loading: false },
			});
		}
	};
};

export const makePayPeriodActive = (payPeriodId) => {
	return async (dispatch) => {
		dispatch({
			type: PayrollStructureActions.ACTIVATE_PAY_PERIOD,
			payload: { loading: true },
		});
		const options = API.options('POST', token, {});
		try {
			const response = await API.request(
				`/payroll/pay-period/${payPeriodId}/`,
				options
			);
			await dispatch({
				type: PayrollStructureActions.ACTIVATE_PAY_PERIOD,
				payload: { loading: false, data: response.data },
			});

			return response.data;
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: PayrollStructureActions.ACTIVATE_PAY_PERIOD,
				payload: { loading: false },
			});
		}
	};
};

export const getBankLetter = () => {
	return async (dispatch) => {
		dispatch({
			type: PayrollStructureActions.GET_BANK_LETTER,
			payload: { loading: true },
		});
		const options = API.options('GET', token, {
			responseType: 'blob',
		});
		try {
			const response = await API.request('/payroll/bank-letter/', options);
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', 'transaction-report.zip');
			document.body.appendChild(link);
			link.click();

			return response.data;
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: PayrollStructureActions.GET_REMUNERATION_BY_ID,
				payload: { loading: false },
			});
		}
	};
};

export const getEmployeeTransaction = (Id) => {
	return async (dispatch) => {
		dispatch({
			type: PayrollStructureActions.GET_TRANSACTION,
			payload: { loading: true },
		});
		const options = API.options('GET', token, {});
		try {
			const response = await API.request(
				`/payroll/transaction/${Id}/`,
				options
			);

			await dispatch({
				type: PayrollStructureActions.GET_TRANSACTION,
				payload: { loading: false, data: response.data },
			});

			return response.data;
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: PayrollStructureActions.GET_TRANSACTION,
				payload: { loading: false },
			});
		}
	};
};

export const addEmployeeTransaction = (employeeId, data, activeId) => {
	return async (dispatch) => {
		dispatch({
			type: PayrollStructureActions.ADD_TRANSACTION,
			payload: { loading: true },
		});
		const options = API.options('POST', token, { data });

		let url = `/payroll/transaction/${employeeId}/`;
		if (activeId) {
			url = `/payroll/transaction/${employeeId}/${activeId}/`;
		}
		try {
			const response = await API.request(url, options);
			await dispatch({
				type: PayrollStructureActions.ADD_TRANSACTION,
				payload: { loading: true, data: response.data },
			});

			return window.location.reload();
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: PayrollStructureActions.ADD_TRANSACTION,
				payload: { loading: false },
			});
		}
	};
};

export const getEmployeeDrivenTaxRelief = (employeeId) => {
	return async (dispatch) => {
		dispatch({
			type: PayrollStructureActions.GET_EMPLOYEE_DRIVEN_TAX,
			payload: { loading: true },
		});
		const options = API.options('GET', token);

		const url = `/payroll/employee/tax-relief/${employeeId}`;
		try {
			const response = await API.request(url, options);
			await dispatch({
				type: PayrollStructureActions.GET_EMPLOYEE_DRIVEN_TAX,
				payload: { loading: false, data: response.data },
			});
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: PayrollStructureActions.GET_EMPLOYEE_DRIVEN_TAX,
				payload: { loading: false },
			});
		}
	};
};

export const addEmployeeRelief = (employeeId, data) => {
	return async (dispatch) => {
		dispatch({
			type: PayrollStructureActions.ADD_EMPLOYEE_DRIVEN_TAX,
			payload: { loading: true },
		});
		const options = API.options('POST', token, { data });

		const url = `/payroll/employee/tax-relief/${employeeId}/`;
		try {
			await API.request(url, options);
			await dispatch({
				type: PayrollStructureActions.ADD_EMPLOYEE_DRIVEN_TAX,
				payload: { loading: true },
			});

			return window.location.reload();
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: PayrollStructureActions.ADD_EMPLOYEE_DRIVEN_TAX,
				payload: { loading: false },
			});
		}
	};
};

export const getPayrollReadyForTransaction = () => {
	return async (dispatch) => {
		dispatch({
			type: PayrollStructureActions.GET_PAYROLL_READY_FOR_TRANSACTION,
			payload: { loading: true },
		});
		const options = API.options('GET', token, {});
		try {
			const response = await API.request(
				`/payroll/transaction-allowed/`,
				options
			);

			await dispatch({
				type: PayrollStructureActions.GET_PAYROLL_READY_FOR_TRANSACTION,
				payload: { loading: false, data: response.data },
			});

			return response.data;
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: PayrollStructureActions.GET_PAYROLL_READY_FOR_TRANSACTION,
				payload: { loading: false },
			});
		}
	};
};

export const getEmployeeDrivenPayroll = (employeeId) => {
	return async (dispatch) => {
		dispatch({
			type: PayrollStructureActions.GET_EMPLOYEE_DRIVEN_PAYROLL,
			payload: { loading: true },
		});
		const options = API.options('GET', token);

		const url = `/payroll/employee-driven/${employeeId}`;
		try {
			const response = await API.request(url, options);
			await dispatch({
				type: PayrollStructureActions.GET_EMPLOYEE_DRIVEN_PAYROLL,
				payload: { loading: false, data: response.data },
			});
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: PayrollStructureActions.GET_EMPLOYEE_DRIVEN_PAYROLL,
				payload: { loading: false },
			});
		}
	};
};

export const addEmployeeDrivenPayroll = (employeeId, data) => {
	return async (dispatch) => {
		dispatch({
			type: PayrollStructureActions.ADD_EMPLOYEE_DRIVEN_PAYROLL,
			payload: { loading: true },
		});
		const options = API.options('POST', token, { data });

		const url = `/payroll/employee-driven/${employeeId}/`;
		try {
			await API.request(url, options);
			await dispatch({
				type: PayrollStructureActions.ADD_EMPLOYEE_DRIVEN_PAYROLL,
				payload: { loading: true },
			});

			return window.location.reload();
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: PayrollStructureActions.ADD_EMPLOYEE_DRIVEN_PAYROLL,
				payload: { loading: false },
			});
		}
	};
};

export const getPayrollLoans = () => {
	return async (dispatch) => {
		dispatch({
			type: PayrollStructureActions.GET_LOANS,
			payload: { loading: true },
		});
		const options = API.options('GET', token);

		const url = `/payroll/loan-setup`;
		try {
			const response = await API.request(url, options);
			await dispatch({
				type: PayrollStructureActions.GET_LOANS,
				payload: { loading: false, data: response.data },
			});
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: PayrollStructureActions.GET_LOANS,
				payload: { loading: false },
			});
		}
	};
};

export const addLoan = (data) => {
	return async (dispatch) => {
		dispatch({
			type: PayrollStructureActions.ADD_LOAN,
			payload: {
				loading: true,
			},
		});
		const options = API.options('POST', token, { data });

		try {
			await API.request('/payroll/loan-setup/', options);

			dispatch({
				type: PayrollStructureActions.ADD_LOAN,
				payload: {
					loading: false,
				},
			});

			dispatch(getPayrollLoans());

			return dispatch(setAlert(`Loan added successfully.`, 'success'));
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: PayrollStructureActions.ADD_LOAN,
				payload: {
					loading: false,
				},
			});
			throw err;
		}
	};
};

export const editLoan = (id, data) => {
	return async (dispatch) => {
		dispatch({
			type: PayrollStructureActions.ADD_LOAN,
			payload: {
				loading: true,
			},
		});
		const options = API.options('PATCH', token, { data });

		try {
			await API.request(`/payroll/loan-setup/${id}/`, options);

			dispatch({
				type: PayrollStructureActions.ADD_LOAN,
				payload: {
					loading: false,
				},
			});

			dispatch(getPayrollLoans());

			return dispatch(setAlert(`Loan updated successfully.`, 'success'));
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: PayrollStructureActions.ADD_LOAN,
				payload: {
					loading: false,
				},
			});
			throw err;
		}
	};
};
