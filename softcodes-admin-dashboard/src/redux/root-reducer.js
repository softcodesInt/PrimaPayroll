/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

/* -------------------------- Internal Dependencies ------------------------- */
import userReducer from 'redux/user/reducers';
import alertReducer from './alert/reducer';
import accountsReducer from './accounts/reducers';

const persistConfig = {
	key: 'root',
	storage,
	whitelist: [''],
};

/**
 * @function
 */
export const rootReducer = combineReducers({
	user: userReducer,
	alerts: alertReducer,
	accounts: accountsReducer,
});

export default persistReducer(persistConfig, rootReducer);
