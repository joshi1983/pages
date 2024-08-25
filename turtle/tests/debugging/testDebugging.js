import { testFormatNumber } from './testFormatNumber.js';
import { wrapAndCall } from '../helpers/wrapAndCall.js';

export function testDebugging(logger) {
	wrapAndCall([
		testFormatNumber
	], logger);
};