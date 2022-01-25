const isAuthenticated = () => {
	const data = localStorage.getItem('SOFT_PAY_TOKEN');

	if (!data) {
		return false;
	}

	return true;
};

export const isAdminUser = () => {
	const data = localStorage.getItem('SOFT_PAY_LEVEL');
	return data === '1';
};

export default isAuthenticated;
