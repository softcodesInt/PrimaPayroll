import React from 'react';
import Stepper from 'components/steppers';

const allSteps = (handleStepClick) => {
	const titles = [
		{
			title: 'Employee Info',
			param: 'employee-info',
		},
		{
			title: 'Company Policy',
			param: 'policy-info',
		},
		{
			title: 'Employment Info',
			param: 'employment-info',
		},
		// {
		// 	title: 'Payslip',
		// 	param: 'payslip-info',
		// },
		{
			title: 'Leave Setup',
			param: 'leave-info',
		},
	];

	return titles.map((title, index) => ({
		title: title.title,
		onClick: (e) => {
			e.preventDefault();
			handleStepClick(title.param);
		},
	}));
};

const EmployeeFormStepper = ({ activeStep = 1, handleStepClick }) => {
	return <Stepper steps={allSteps(handleStepClick)} activeStep={activeStep} />;
};

export default EmployeeFormStepper;
