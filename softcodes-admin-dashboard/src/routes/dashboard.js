/* -------------------------- External Dependencies ------------------------- */
import React, { Suspense, lazy } from 'react';
import { Switch, Route } from 'react-router-dom';

/* -------------------------- Internal Dependencies ------------------------- */
import Layout from 'components/layout/dashboard-layout';
import Loader from 'components/loader';
import Companies from 'pages/dashboard/companies';
import Staff from 'pages/dashboard/staff';
import CompanyProfile from 'pages/dashboard/companies/views/company-profile';
import StaffProfile from 'pages/dashboard/staff/views/staff-profile';
import CreateStaff from 'pages/dashboard/staff/views/create';
import CreateCompany from 'pages/dashboard/companies/views/create-company';

/* -------------------------- Components Dependencies ------------------------- */
const Dashboard = lazy(() => import('../pages/dashboard'));

const DashboardRoutes = ({ location }) => {
	return (
		<>
			<Layout>
				<Suspense fallback={<Loader loadingText="Please Wait" />}>
					<Switch>
						<Route path="/dashboard" exact component={Dashboard} />
						<Route path="/dashboard/companies" exact component={Companies} />
						<Route
							path="/dashboard/companies/create"
							exact
							component={CreateCompany}
						/>
						<Route
							path="/dashboard/companies/edit/:id"
							exact
							component={CreateCompany}
						/>
						<Route path="/dashboard/company/:id" component={CompanyProfile} />

						<Route path="/dashboard/staff" exact component={Staff} />
						<Route
							path="/dashboard/staff/create"
							exact
							component={CreateStaff}
						/>
						<Route
							path="/dashboard/staff/edit/:id"
							exact
							component={CreateStaff}
						/>
						<Route path="/dashboard/staffs/:id" component={StaffProfile} />
					</Switch>
				</Suspense>
			</Layout>
		</>
	);
};

export default DashboardRoutes;
