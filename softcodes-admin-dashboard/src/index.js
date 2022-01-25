import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from 'redux/store';

import App from './App';
import history from './utils/history';
import * as serviceWorker from './utils/serviceWorker';
import reportWebVitals from './utils/webVitals';
import './assets/styles/index.css';
import ScrollToTop from 'utils/scroll-to-top';

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<Router history={history}>
				<ScrollToTop />
				<PersistGate loading={null} persistor={persistor}>
					<App />
				</PersistGate>
			</Router>
		</Provider>
	</React.StrictMode>,

	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
reportWebVitals();
