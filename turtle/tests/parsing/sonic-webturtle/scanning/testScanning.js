import { testIsMarkingEndOfToken } from './testIsMarkingEndOfToken.js';
import { testIsStringLiteral } from './testIsStringLiteral.js';
import { testIsValidInputToken } from './testIsValidInputToken.js';
import { testScan } from './testScan.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testScanning(logger) {
	wrapAndCall([
		testIsMarkingEndOfToken,
		testIsStringLiteral,
		testIsValidInputToken,
		testScan
	], logger);
};