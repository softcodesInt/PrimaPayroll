import React from 'react';

import NavLayout from 'components/layout/dashboard-layout/navbar';
import RuleInfo from './views/rule-info';

const Policy = () => {
	return (
		<>
			<NavLayout title="Company Policy" />
			<RuleInfo noNav />
		</>
	);
};

export default Policy;
