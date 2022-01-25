import React, { Suspense, lazy } from 'react';
import { Switch, Route } from 'react-router-dom';

import Layout from 'components/layout/dashboard-layout';
import Loader from 'components/loader';
import ViewHead from 'pages/dashboard/company-structure/views/view-head';
import Leave from 'pages/dashboard/leaves';
import ViewLeave from 'pages/dashboard/leaves/views/view-leave';
import LeaveWorkflow from 'pages/dashboard/leaves/views/workflow';
import LeaveWorkflowRequest from 'pages/dashboard/leaves/views/workflow/request';
import Subsidiaries from 'pages/dashboard/subsidiaries';
import Policy from 'pages/dashboard/policies';
import TaxTable from 'pages/dashboard/policies/views/tax-table';
import PayPeriod from 'pages/dashboard/policies/views/pay-period';
import HolidaySetup from 'pages/dashboard/policies/views/holidays';
import RuleInfo from 'pages/dashboard/policies/views/rule-info';
import Earnings from 'pages/dashboard/payroll/earnings';
import Deductions from 'pages/dashboard/payroll/deductions';
import Contributions from 'pages/dashboard/payroll/contributions';
import Additions from 'pages/dashboard/payroll/additions';
import Provisions from 'pages/dashboard/payroll/provisions';
import FringeBenefits from 'pages/dashboard/payroll/fringe-benefits';
import PayrollCategories from 'pages/dashboard/payroll/payroll-categories';
import EmployeeDrivenPayroll from 'pages/dashboard/payroll/employee';
import Remuneration from 'pages/dashboard/remuneration';
import Banks from 'pages/dashboard/settings/bank-lists';
import JobTitle from 'pages/dashboard/settings/job-title';
import NatureOfContract from 'pages/dashboard/settings/nature-of-contracts';
import JobGrade from 'pages/dashboard/settings/job-grades';
import TerminateReason from 'pages/dashboard/settings/terminate-reasons';
import ReinstateReason from 'pages/dashboard/settings/reinstate-reasons';
import Pension from 'pages/dashboard/settings/pension';
import AddEmployee from 'pages/dashboard/employees/components/add-employee';
import EmployeeList from 'pages/dashboard/employees/components/';
import EmployeeDetail from 'pages/dashboard/employees/components/employee-detail';
import ExportImport from 'pages/dashboard/export-import';
import Transactions from 'pages/dashboard/transactions';
import TaxReliefGroup from 'pages/dashboard/tax-management/tax-relief-groups';
import TaxRelief from 'pages/dashboard/tax-management/tax-relief';
import EmployeeDrivenTaxRelief from 'pages/dashboard/tax-management/employee-driven';
import BackupRestore from 'pages/dashboard/settings/backup-restore';
import Loans from 'pages/dashboard/payroll/loan';
import UserAccess from 'pages/dashboard/user-access';
import { isAdminUser } from 'utils/is-authenticated';
import Dashboard from '../pages/dashboard/dashboard-tableau';
import Details from 'pages/ess/details';
import payslips from 'pages/ess/payslips';
import leaves from 'pages/ess/leaves';
import leavesRequest from 'pages/ess/leaves-request';

/* -------------------------- Components Dependencies ------------------------- */
const CompanyStructure = lazy(() =>
	import('../pages/dashboard/company-structure')
);

const DashboardRoutes = ({ location }) => {
	return (
		<>
			<Layout>
				<Suspense fallback={<Loader loadingText="Please Wait" />}>
					{isAdminUser() ? (
						<Switch>
							<Route path="/dashboard" exact component={Dashboard} />
							<Route
								path="/dashboard/company-structure"
								exact
								component={CompanyStructure}
							/>
							<Route
								path="/dashboard/company-structure/:id"
								component={ViewHead}
							/>

							<Route path="/dashboard/leaves" exact component={Leave} />
							<Route
								path="/dashboard/subsidiaries"
								exact
								component={Subsidiaries}
							/>

							<Route path="/dashboard/leaves/:id" component={ViewLeave} />
							<Route
								path="/dashboard/workflow/leaves/"
								component={LeaveWorkflow}
							/>
							<Route
								path="/dashboard/request/leaves/"
								component={LeaveWorkflowRequest}
							/>
							<Route path="/dashboard/policies" exact component={Policy} />
							<Route
								path="/dashboard/policies/rule-info"
								exact
								component={RuleInfo}
							/>
							<Route
								path="/dashboard/settings/holiday-setup"
								exact
								component={HolidaySetup}
							/>

							<Route
								path="/dashboard/policies/tax-table"
								exact
								component={TaxTable}
							/>
							<Route
								path="/dashboard/policies/pay-period/:id"
								component={PayPeriod}
							/>
							<Route path="/dashboard/payroll" exact component={Earnings} />
							<Route
								path="/dashboard/payroll/earnings"
								exact
								component={Earnings}
							/>
							<Route
								path="/dashboard/payroll/deductions"
								exact
								component={Deductions}
							/>
							<Route
								path="/dashboard/payroll/contributions"
								exact
								component={Contributions}
							/>
							<Route
								path="/dashboard/payroll/fringe-benefits"
								exact
								component={FringeBenefits}
							/>
							<Route
								path="/dashboard/payroll/provisions"
								exact
								component={Provisions}
							/>
							<Route
								path="/dashboard/payroll/additions"
								exact
								component={Additions}
							/>
							<Route
								path="/dashboard/payroll/payroll-categories"
								exact
								component={PayrollCategories}
							/>
							<Route
								path="/dashboard/payroll/employee"
								exact
								component={EmployeeDrivenPayroll}
							/>
							<Route
								path="/dashboard/payroll/loan-setup"
								exact
								component={Loans}
							/>
							<Route
								path="/dashboard/remuneration"
								exact
								component={Remuneration}
							/>
							<Route path="/dashboard/settings/banks" exact component={Banks} />
							<Route
								path="/dashboard/settings/job-title"
								exact
								component={JobTitle}
							/>
							<Route
								path="/dashboard/settings/nature-of-contract"
								exact
								component={NatureOfContract}
							/>
							<Route
								path="/dashboard/settings/job-grades"
								exact
								component={JobGrade}
							/>
							<Route
								path="/dashboard/settings/terminate-reason"
								exact
								component={TerminateReason}
							/>
							<Route
								path="/dashboard/settings/reinstate-reason"
								exact
								component={ReinstateReason}
							/>
							<Route
								path="/dashboard/settings/pension"
								exact
								component={Pension}
							/>
							<Route
								path="/dashboard/settings/backup-restore"
								exact
								component={BackupRestore}
							/>
							<Route
								path="/dashboard/employee/add"
								exact
								component={AddEmployee}
							/>
							<Route
								path="/dashboard/employee/list"
								exact
								component={EmployeeList}
							/>
							<Route
								path="/dashboard/employee/detail/:id"
								exact
								component={EmployeeDetail}
							/>
							<Route
								path="/dashboard/employee/edit/:id"
								exact
								component={AddEmployee}
							/>
							<Route
								path="/dashboard/employee/terminate"
								exact
								component={JobTitle}
							/>
							<Route
								path="/dashboard/tax-management/tax-relief-group"
								exact
								component={TaxReliefGroup}
							/>
							<Route
								path="/dashboard/tax-management/tax-relief"
								exact
								component={TaxRelief}
							/>
							<Route
								path="/dashboard/tax-management/tax-table"
								exact
								component={TaxTable}
							/>
							<Route
								path="/dashboard/tax-management/employee-driven"
								exact
								component={EmployeeDrivenTaxRelief}
							/>
							<Route
								path="/dashboard/export-import"
								exact
								component={ExportImport}
							/>
							<Route
								path="/dashboard/user-access"
								exact
								component={UserAccess}
							/>
							<Route
								path="/dashboard/transactions"
								exact
								component={Transactions}
							/>
						</Switch>
					) : (
						<Switch>
							<Route path="/dashboard/ess/me" exact component={Details} />
							<Route
								path="/dashboard/ess/payslips"
								exact
								component={payslips}
							/>
							<Route path="/dashboard/ess/leaves" exact component={leaves} />
							<Route
								path="/dashboard/ess/leave-request"
								exact
								component={leavesRequest}
							/>
						</Switch>
					)}
				</Suspense>
			</Layout>
		</>
	);
};

export default DashboardRoutes;
