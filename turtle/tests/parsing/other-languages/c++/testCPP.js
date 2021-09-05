import { testIsLikelyCPP } from './testIsLikelyCPP.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testCPP(logger) {
	wrapAndCall([
		testIsLikelyCPP
	], logger);
};