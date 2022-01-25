import React, { useEffect } from 'react';
import styled from 'styled-components';
import NavLayout from 'components/layout/dashboard-layout/navbar';
import { isAdminUser } from 'utils/is-authenticated';
import history from 'utils/history';

const Dashboard = () => {
	useEffect(() => {
		if (isAdminUser()) {
			history.push('/dashboard/policies');
		} else {
			history.push('/dashboard/ess/me');
		}
	}, []);
	return (
		<>
			<NavLayout title="Dashboard" />
			<DashboardWrapper>
				<h1>Hey</h1>
			</DashboardWrapper>
		</>
	);
};

const DashboardWrapper = styled.div``;

export default Dashboard;
