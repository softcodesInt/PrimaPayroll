/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React from 'react';

/* --------------------------- Image Dependencies --------------------------- */
import { useMount } from 'broad-state';
import { getAllPayrolls } from 'redux/payroll/actions';
import { connect } from 'react-redux';
import PayrollElement from '../components/payroll-element';

const FringeBenefits = ({ getAllPayrolls }) => {
	useMount(() => {
		getAllPayrolls('', 1, null, 'FRINGE_BENEFIT');
	});

	return <PayrollElement type="FRINGE_BENEFITS" />;
};

export default connect(null, {
	getAllPayrolls,
})(FringeBenefits);
