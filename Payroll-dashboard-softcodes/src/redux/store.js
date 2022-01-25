/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import logger from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from 'redux/root-reducer';
import { persistStore } from 'redux-persist';

/**
 * @function
 */
const middlewears = [thunk];

if (process.env.NODE_ENV === 'development') {
	middlewears.push(logger);
}

/**
 * @function
 */
export const store = createStore(rootReducer, applyMiddleware(...middlewears));

export const persistor = persistStore(store);
export default { store, persistor };
