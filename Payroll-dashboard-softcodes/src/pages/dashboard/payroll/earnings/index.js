/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React from 'react';

/* --------------------------- Image Dependencies --------------------------- */
import { useMount } from 'broad-state';
import { getAllPayrolls } from 'redux/payroll/actions';
import { connect } from 'react-redux';
import PayrollElement from '../components/payroll-element';

const Earnings = ({ getAllPayrolls }) => {
	useMount(() => {
		getAllPayrolls('', 1, null, 'EARNINGS');
	});

	return <PayrollElement type="EARNINGS" />;
};

export default connect(null, {
	getAllPayrolls,
})(Earnings);
