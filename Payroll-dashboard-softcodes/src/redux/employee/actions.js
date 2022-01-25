import { setAlert } from 'redux/alert/actions';
import API from 'services/api';
import { getError } from 'utils';
import { token } from 'utils/user_persist';
import EmployeeStructure from './types';

export const addEmployee = (data) => {
	return async (dispatch) => {
		dispatch({
			type: EmployeeStructure.ADD_EMPLOYEE,
			payload: {
				loading: true,
			},
		});
		const options = API.options('POST', token, { data });

		try {
			const response = await API.request('/employees/employee-info/', options);

			dispatch({
				type: EmployeeStructure.ADD_EMPLOYEE,
				payload: {
					loading: false,
				},
			});
			dispatch(setAlert(`Employee Info added successfully.`, 'success'));
			return response.data.id;
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: EmployeeStructure.ADD_EMPLOYEE,
				payload: {
					loading: false,
				},
			});
			throw err;
		}
	};
};

export const editEmployee = (id, data, nextPath) => {
	return async (dispatch) => {
		dispatch({
			type: EmployeeStructure.EDIT_EMPLOYEE,
			payload: {
				loading: true,
			},
		});
		const options = API.options('PATCH', token, { data });

		try {
			await API.request(`/employees/employee-info/${id}/`, options);
			dispatch({
				type: EmployeeStructure.EDIT_EMPLOYEE,
				payload: {
					loading: false,
				},
			});

			if (nextPath) window.location = nextPath;

			dispatch(setAlert(`Employee updated successfully.`, 'success'));
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: EmployeeStructure.EDIT_EMPLOYEE,
				payload: {
					loading: false,
				},
			});
			throw err;
		}
	};
};

export const getAllEmployees = (search = '', page = 1, url) => {
	return async (dispatch) => {
		dispatch({
			type: EmployeeStructure.GET_EMPLOYEES,
			payload: { loading: true },
		});
		const options = API.options('GET', token, {});
		try {
			const response = !url
				? await API.request(
						`/employees/employee-info/?page=${page}&search=${search}`,
						options
				  )
				: await API.request(url, options, true);

			await dispatch({
				type: EmployeeStructure.GET_EMPLOYEES,
				payload: {
					loading: false,
					data: {
						...response.data,
					},
				},
			});

			return response.data;
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: EmployeeStructure.GET_EMPLOYEES,
				payload: { loading: false },
			});
		}
	};
};

export const getEmployeeById = (Id) => {
	return async (dispatch) => {
		dispatch({
			type: EmployeeStructure.GET_EMPLOYEE,
			payload: { loading: true },
		});
		const options = API.options('GET', token, {});
		try {
			const response = await API.request(
				`/employees/employee-info/${Id}/`,
				options
			);

			await dispatch({
				type: EmployeeStructure.GET_EMPLOYEE,
				payload: { loading: false, data: response.data },
			});

			return response.data;
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: EmployeeStructure.GET_EMPLOYEE,
				payload: { loading: false },
			});
		}
	};
};

export const getEmployeePayslip = (Id) => {
	return async (dispatch) => {
		dispatch({
			type: EmployeeStructure.GET_EMPLOYEE_PAYSLIP,
			payload: { loading: true },
		});
		const options = API.options('GET', token, {});
		try {
			const response = await API.request(
				`/employees/employee/${Id}/payslips`,
				options
			);

			await dispatch({
				type: EmployeeStructure.GET_EMPLOYEE_PAYSLIP,
				payload: { loading: false, data: response.data },
			});

			return response.data;
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: EmployeeStructure.GET_EMPLOYEE_PAYSLIP,
				payload: { loading: false },
			});
		}
	};
};

export const downloadPayslip = (payslipId) => {
	return async (dispatch) => {
		dispatch({
			type: EmployeeStructure.DOWNLOAD_PAYSLIP,
			payload: { loading: true },
		});
		const options = API.options('GET', token, {
			responseType: 'blob',
		});
		try {
			const response = await API.request(
				`/employees/employee/${payslipId}/download-payslip`,
				options
			);
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', 'payslip.pdf');
			document.body.appendChild(link);
			link.click();

			return response.data;
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: EmployeeStructure.DOWNLOAD_PAYSLIP,
				payload: { loading: false },
			});
		}
	};
};

export const downloadAllPayslip = (date) => {
	return async (dispatch) => {
		dispatch({
			type: EmployeeStructure.DOWNLOAD_PAYSLIP,
			payload: { loading: true },
		});
		const options = API.options('GET', token, {
			responseType: 'blob',
		});
		try {
			const response = await API.request(
				`/accounts/employee/download-all-payslips?date=${date}`,
				options
			);
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', 'employee-payslips.zip');
			document.body.appendChild(link);
			link.click();

			return response.data;
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: EmployeeStructure.DOWNLOAD_PAYSLIP,
				payload: { loading: false },
			});
		}
	};
};

export const sendEssInvitation = (Id) => {
	return async (dispatch) => {
		dispatch({
			type: EmployeeStructure.SEND_INVITATION,
			payload: { loading: true },
		});
		const options = API.options('GET', token, {});
		try {
			const response = await API.request(
				`/employees/employee/${Id}/ess-invite`,
				options
			);

			await dispatch({
				type: EmployeeStructure.SEND_INVITATION,
				payload: { loading: false, data: response.data },
			});

			return response.data;
		} catch (err) {
			getError(dispatch, err);
			await dispatch({
				type: EmployeeStructure.SEND_INVITATION,
				payload: { loading: false },
			});
		}
	};
};
