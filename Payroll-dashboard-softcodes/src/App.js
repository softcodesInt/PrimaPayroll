/* -------------------------------------------------------------------------- */
/*                            External Dependency                         */
/* -------------------------------------------------------------------------- */

import React from 'react';
import Alerts from 'components/alerts';

/* --------------------------- Internal Dependency -------------------------- */
import Routes from 'routes';

const App = () => {
	return (
		<>
			<Alerts />
			<Routes />
		</>
	);
};

export default App;
