import { TimeLocalStorage } from '../../../modules/set/animation-time/TimeLocalStorage.js';

export function testTimeLocalStorage(logger) {
	const isUsed = TimeLocalStorage.isUsed();
	if (typeof isUsed !== 'boolean')
		logger('isUsed expected to be boolean but got ' + isUsed);
	if (isUsed)
		TimeLocalStorage.saveUsed();
};