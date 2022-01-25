/* -------------------------- Internal Dependencies ------------------------- */
import FileSaver from 'file-saver';
import { setAlert } from 'redux/alert/actions';
import API from 'services/api';
import { getError } from 'utils';
import { token } from 'utils/user_persist';
import ExportImportStructure from './types';

/**
 * @namespace dispatch
 */

/**
 * Activate License
 * @function
 * @param {Object} data
 * @returns {Function}
 */
export const exportFile = (data) => {
	return async (dispatch) => {
		dispatch({
			type: ExportImportStructure.EXPORT,
			payload: {
				loading: true,
			},
		});
		const options = API.options('POST', token, {
			data,
			responseType: 'blob',
		});

		try {
			const response = await API.request('/export-import/export/', options);

			dispatch({
				type: ExportImportStructure.EXPORT,
				payload: {
					loading: false,
				},
			});

			const blob = new Blob([response.data], {
				type:
					'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			});
			FileSaver.saveAs(blob, `${data.module}.xlsx`);

			dispatch(setAlert(`Exported successfully.`, 'success'));
			return response;
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: ExportImportStructure.EXPORT,
				payload: {
					loading: false,
				},
			});
			throw err;
		}
	};
};

export const importFile = (data) => {
	return async (dispatch) => {
		dispatch({
			type: ExportImportStructure.IMPORT,
			payload: {
				loading: true,
			},
		});
		const options = API.options('POST', token, {
			data,
		});

		try {
			const response = await API.request('/export-import/import/', options);

			dispatch({
				type: ExportImportStructure.IMPORT,
				payload: {
					loading: false,
				},
			});

			dispatch(setAlert(`Imported successfully.`, 'success'));
			return response;
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: ExportImportStructure.IMPORT,
				payload: {
					loading: false,
				},
			});
		}
	};
};

export const downloadBackup = () => {
	return async (dispatch) => {
		dispatch({
			type: ExportImportStructure.DOWNLOAD_BACKUP,
			payload: {
				loading: true,
			},
		});
		const options = API.options('GET', token, {
			responseType: 'blob',
		});

		try {
			const response = await API.request('/company/backup-restore/', options);

			dispatch({
				type: ExportImportStructure.DOWNLOAD_BACKUP,
				payload: {
					loading: false,
				},
			});

			const blob = new Blob([response.data]);
			FileSaver.saveAs(blob, 'backup.psql.gpg');

			dispatch(setAlert(`Backed up successfully.`, 'success'));
			return response;
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: ExportImportStructure.DOWNLOAD_BACKUP,
				payload: {
					loading: false,
				},
			});
			throw err;
		}
	};
};

export const restoreBackup = (data) => {
	return async (dispatch) => {
		dispatch({
			type: ExportImportStructure.IMPORT_BACKUP,
			payload: {
				loading: true,
			},
		});
		const options = API.options('POST', token, {
			data,
		});

		try {
			const response = await API.request('/company/backup-restore/', options);

			dispatch({
				type: ExportImportStructure.IMPORT_BACKUP,
				payload: {
					loading: false,
				},
			});

			dispatch(setAlert(`Backup Restored successfully.`, 'success'));
			return response;
		} catch (err) {
			getError(dispatch, err);
			dispatch({
				type: ExportImportStructure.IMPORT_BACKUP,
				payload: {
					loading: false,
				},
			});
		}
	};
};
