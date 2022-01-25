/* -------------------------- Internal Dependencies ------------------------- */
import { selectAlertItems } from '../selector';

describe('Alert Selectors', () => {
	let mockParameters;
	beforeEach(() => {
		mockParameters = {
			alerts: [
				{
					id: 'me23423',
					msg: 'message',
					alertType: 'success',
				},
			],
		};
	});

	it('should return alerts', () => {
		const selected = selectAlertItems.resultFunc(mockParameters.alerts);
		expect(selected).toEqual(mockParameters.alerts);
	});
	it('should return  array', () => {
		const selected = selectAlertItems.resultFunc(mockParameters.alerts);
		expect(Array.isArray(selected)).toBe(true);
	});
});
