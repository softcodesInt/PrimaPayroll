/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React from 'react';

/* --------------------------- Image Dependencies --------------------------- */
import { useMount } from 'broad-state';
import { getAllPayrolls } from 'redux/payroll/actions';
import { connect } from 'react-redux';
import PayrollElement from '../components/payroll-element';

const Provisions = ({ getAllPayrolls }) => {
	useMount(() => {
		getAllPayrolls('', 1, null, 'PROVISIONS');
	});

	return <PayrollElement type="PROVISIONS" />;
};

export default connect(null, {
	getAllPayrolls,
})(Provisions);
