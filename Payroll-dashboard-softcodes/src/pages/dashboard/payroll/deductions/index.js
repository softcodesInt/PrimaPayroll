/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React from 'react';

/* --------------------------- Image Dependencies --------------------------- */
import { useMount } from 'broad-state';
import { getAllPayrolls } from 'redux/payroll/actions';
import { connect } from 'react-redux';
import PayrollElement from '../components/payroll-element';

const Deductions = ({ getAllPayrolls }) => {
	useMount(() => {
		getAllPayrolls('', 1, null, 'DEDUCTIONS');
	});

	return <PayrollElement type="DEDUCTIONS" />;
};

export default connect(null, {
	getAllPayrolls,
})(Deductions);
