import { setAlert } from 'redux/alert/actions';
import moment from 'moment';
/**
 * capitalize string
 * @param {*} string
 */
export const capitalize = (string) => {
	if (typeof string !== 'string') return '';
	return (
		string.charAt(0).toUpperCase() +
		[...string]
			.join('')
			?.toLowerCase()
			?.slice(1)
	);
};

export const getErrorMessage = (data) => {
	return Object.values(data).join(', ');
};
export const handleError = (error) => {
	let errorMsg;
	if (error.response === undefined) {
		errorMsg = 'Cannot reach server'; // it means not internet
	} else if (error.response && error.response.status === 500) {
		errorMsg = 'A server error occured';
	} else if (error.response && error.response.status < 500) {
		errorMsg = getErrorMessage(error.response.data);
	}
	return errorMsg;
};
/**
 * Curate errors on the platform and output something readable
 * @param {Function} dispatch
 * @param {Object} err
 * @param {String} type
 */
export const getError = (dispatch, err, type = 'error') => {
	dispatch(setAlert(handleError(err), type));
};

/**
 * Get Avatar
 * @param {String} val
 */
export const getAvatar = (val, tile = false) => {
	if (!tile) {
		return val.split('')[0].match(/^[aeiw]+$/gim)
			? '#218625'
			: val.split('')[0].match(/^[ouyg]+$/gim)
			? '#e91e63'
			: val.split('')[0].match(/^[bdfm]+$/gim)
			? '#ff5722'
			: '#247cce';
	}
	return val.split('')[0].match(/^[aeiw]+$/gim)
		? '#e91e63'
		: val.split('')[0].match(/^[ouyg]+$/gim)
		? '#009688'
		: val.split('')[0].match(/^[bdfm]+$/gim)
		? '#16c06d'
		: '#fec34a';
};

/**
 * Get function to sleep
 * @param {String} ms
 */
export const sleep = (ms) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Copy to clipboard
 * @param {String} str
 */
export const copyToClipboard = (str) => {
	const el = document.createElement('textarea');
	el.value = str;
	el.setAttribute('readonly', '');
	el.style.position = 'absolute';
	el.style.left = '-9999px';
	document.body.appendChild(el);
	const selected =
		document.getSelection().rangeCount > 0
			? document.getSelection().getRangeAt(0)
			: false;
	el.select();
	document.execCommand('copy');
	document.body.removeChild(el);
	if (selected) {
		document.getSelection().removeAllRanges();
		document.getSelection().addRange(selected);
	}
};

/**
 * Group Data By Data
 * @param {Array} data
 */
export const groupByDate = (data) => {
	return data
		.reduce((acc, val) => {
			const timestamp = val.timestamp.match(/\d{4}-\d{2}-\d{2}/g).toString();

			const item = acc.find((item) =>
				item.date.match(new RegExp(timestamp, 'g'))
			);

			if (!item && item === undefined) {
				acc.unshift({
					date: val.timestamp,
					data: [val],
					heading: moment(timestamp)
						.calendar()
						.replace('at 12:00 AM', ''),
				});
			} else {
				item.data.push(val);
			}
			return acc;
		}, [])
		.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const getQueryParams = () => {
	return window.location.search
		.replace('?', '')
		.split('&')
		.reduce(
			// eslint-disable-next-line
			(r, e) => ((r[e.split('=')[0]] = decodeURIComponent(e.split('=')[1])), r),
			{}
		);
};

const convertArrayOfObjectsToCSV = (args) => {
	var result, ctr, keys, columnDelimiter, lineDelimiter, data;

	data = args.data || null;
	if (data == null || !data.length) {
		return null;
	}

	columnDelimiter = args.columnDelimiter || ',';
	lineDelimiter = args.lineDelimiter || '\n';

	keys = Object.keys(data[0]);

	result = '';
	result += keys.join(columnDelimiter);
	result += lineDelimiter;

	data.forEach(function(item) {
		ctr = 0;
		keys.forEach(function(key) {
			if (ctr > 0) result += columnDelimiter;

			result += JSON.stringify(item[key]).replace(/[^A-Za-z,-:_' ']/g, '');
			ctr++;
		});
		result += lineDelimiter;
	});

	return result;
};

export const createCSV = (csvData) => {
	var data, link;
	var date = moment(new Date()).format('YY/MM/DD/HH:mm');

	var csv = convertArrayOfObjectsToCSV({
		data: csvData,
	});
	if (csv == null) return;

	if (!csv.match(/^data:text\/csv/i)) {
		csv = 'data:text/csv;charset=utf-8,' + csv;
	}
	data = encodeURI(csv);

	link = document.createElement('a');
	link.setAttribute('href', data);
	link.setAttribute('download', `${date}_company_data.csv`);
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};
