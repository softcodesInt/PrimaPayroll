import React, { useEffect } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { getRemunerationById } from 'redux/payroll/actions';
import {
	selectSingleRemuneration,
	selectisLoading,
} from 'redux/payroll/selectors';
import { getEmployeeById } from 'redux/employee/actions';
import {
	selectisLoading as selectEmployeeLoading,
	selectEmployee,
} from 'redux/employee/selectors';
import Loader from 'components/loader';
import PayslipBreakdownDetail from './payslip-detail';
import Button from 'components/button';

const PayslipFormDisplay = ({
	isEmployeeLoading,
	isLoading,
	remuneration,
	getRemunerationById,
	getEmployeeById,
	moveNext,
	employee,
}) => {
	useEffect(() => {
		if (employee?.remuneration) {
			getRemunerationById(employee.remuneration?.id);
		}
		// eslint-disable-next-line
	}, [employee]);

	return (
		<div className="row">
			{isEmployeeLoading ? (
				<Loader loadingText="Getting Payslip Values" />
			) : (
				<>
					<PayslipBreakdownDetail />
					<p>
						DISCLAIMER: The values broken down are auto-calculated based on the
						remuneration structure payroll elements, these values can always be
						updated during salary payment
					</p>
					<Button
						type="submit"
						className="btn-soft mr-auto mt-4"
						onClick={() => moveNext()}
					>
						Continue
					</Button>
				</>
			)}
		</div>
	);
};

const mapStateToProps = createStructuredSelector({
	isLoading: selectisLoading,
	remuneration: selectSingleRemuneration,
	isEmployeeLoading: selectEmployeeLoading,
	employee: selectEmployee,
});
export default connect(mapStateToProps, {
	getRemunerationById,
	getEmployeeById,
})(PayslipFormDisplay);
