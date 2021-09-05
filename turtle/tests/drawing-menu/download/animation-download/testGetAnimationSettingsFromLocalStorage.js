import { getAnimationSettingsFromLocalStorage } from '../../../../modules/drawing-menu/download/animation-download/getAnimationSettingsFromLocalStorage.js';

export function testGetAnimationSettingsFromLocalStorage(logger) {
	const result = getAnimationSettingsFromLocalStorage();
	if (typeof result !== 'object')
		logger(`Expected an object but got ${result}`);
	else {
		const intKeys = ['fps', 'mode', 'repeatCount', 'resolution', 'snapshotsPerFrame'];
		intKeys.forEach(function(key) {
			if (!Number.isInteger(result[key]))
				logger(`Integer expected for ${key} but loaded ${result[key]}`);
		});
	}
};