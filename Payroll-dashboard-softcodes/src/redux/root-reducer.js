/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

/* -------------------------- Internal Dependencies ------------------------- */
import userReducer from 'redux/user/reducers';
import alertReducer from './alert/reducer';
import companyStructureReducer from './company-structure/reducer';
import payrollStructureReducer from './payroll/reducer';
import leaveStructureReducer from './leave/reducer';
import subsidiaryStructureReducer from './subsidiary/reducer';
import companyPolicyStructureReducer from './company-policy/reducer';
import settingsReducer from './settings/reducers';
import employeesReducer from './employee/reducers';
import taxManagementReducer from './tax-management/reducers';
import exportImportReducer from './export-import/reducers';

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
	company_structure: companyStructureReducer,
	payroll_structure: payrollStructureReducer,
	leave_structure: leaveStructureReducer,
	subsidiary_structure: subsidiaryStructureReducer,
	company_policy_structure: companyPolicyStructureReducer,
	settings: settingsReducer,
	employees: employeesReducer,
	export_import: exportImportReducer,
	taxManagement: taxManagementReducer,
});

export default persistReducer(persistConfig, rootReducer);
