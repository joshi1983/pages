import { testIsStartOfNumber } from './testIsStartOfNumber.js';
import { testNumbers } from './testNumbers.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testScanningDirectory(logger) {
	wrapAndCall([
		testIsStartOfNumber,
		testNumbers,
	], logger);
};