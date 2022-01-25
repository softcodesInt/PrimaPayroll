/* --------------------------- External Dependency -------------------------- */
import jwtDecode from 'jwt-decode';
import { clearState } from 'codewonders-helpers';

const isAuthenticated = () => {
	const data = localStorage.getItem('SOFT_TOKEN');

	if (!data) {
		return false;
	}

	let decoded;

	try {
		decoded = jwtDecode(data);
		const currentDate = new Date();
		const session = decoded.exp * 1000 - currentDate.getTime() > 1;

		if (!session) {
			return clearState();
		}
		return session;
	} catch (error) {
		return false;
	}
};

export default isAuthenticated;
