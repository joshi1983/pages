import { testIsLikelyAtariTurboBasicXL } from './testIsLikelyAtariTurboBasicXL.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testAtariTurboBasicXL(logger) {
	wrapAndCall([
		testIsLikelyAtariTurboBasicXL
	], logger);
};