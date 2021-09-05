import { testIsLikelyPHP } from './testIsLikelyPHP.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testPHP(logger) {
	wrapAndCall([
		testIsLikelyPHP
	], logger);
};