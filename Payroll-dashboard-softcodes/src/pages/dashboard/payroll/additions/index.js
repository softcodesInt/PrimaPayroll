/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React from 'react';

/* --------------------------- Image Dependencies --------------------------- */
import { useMount } from 'broad-state';
import { getAllPayrolls } from 'redux/payroll/actions';
import { connect } from 'react-redux';
import PayrollElement from '../components/payroll-element';

const Additions = ({ getAllPayrolls }) => {
	useMount(() => {
		getAllPayrolls('', 1, null, 'ADDITIONS');
	});

	return <PayrollElement type="ADDITIONS" />;
};

export default connect(null, {
	getAllPayrolls,
})(Additions);
