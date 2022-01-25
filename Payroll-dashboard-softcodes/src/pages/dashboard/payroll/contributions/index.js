/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React from 'react';

/* --------------------------- Image Dependencies --------------------------- */
import { useMount } from 'broad-state';
import { getAllPayrolls } from 'redux/payroll/actions';
import { connect } from 'react-redux';
import PayrollElement from '../components/payroll-element';

const Contributions = ({ getAllPayrolls }) => {
	useMount(() => {
		getAllPayrolls('', 1, null, 'COMPANY_CONTRIBUTION');
	});

	return <PayrollElement type="CONTRIBUTIONS" />;
};

export default connect(null, {
	getAllPayrolls,
})(Contributions);
