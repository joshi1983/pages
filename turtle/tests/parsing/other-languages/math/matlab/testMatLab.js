import { testIsLikelyMatLab } from './testIsLikelyMatLab.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testMatLab(logger) {
	wrapAndCall([
		testIsLikelyMatLab
	], logger);
};