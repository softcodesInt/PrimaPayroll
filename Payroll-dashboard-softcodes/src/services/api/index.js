/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import axios from 'axios';
import { store } from 'redux/store';
import { logOutUser } from 'redux/user/actions';
import BASE_URL from 'services/config';

/**
 * @function
 * @param {String} method
 * @param {String} token
 * @param {Object} options
 */
export const option = (method = 'GET', token = '', options = {}) => {
	if (!options.headers) {
		options.headers = {};
	}

	if (token.length > 1) {
		options.headers.Authorization = `Token ${token}`;
	}

	options.method = method;

	return options;
};

/**
 * @function
 * @param {String} error
 */
export const errorHandler = async (error) => {
	if (error?.response?.status === 401) {
		await store.dispatch(logOutUser());
		return process.browser && window.location.reload();
	}
	throw error; // for chainable catch
};

/**
 * @function
 * @param {String} url
 * @param {Object} options
 */
export const request = async (url, options, noBaseURL = false) => {
	axios.defaults.withCredentials = true;
	return axios({
		url: !noBaseURL ? `${BASE_URL}${url}` : `${url}`,
		...options,
	}).catch(errorHandler);
};

export default {
	options: option,
	errorHandler,
	request,
};
