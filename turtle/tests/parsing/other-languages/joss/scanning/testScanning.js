import { testIsIdentifier } from './testIsIdentifier.js';
import { testIsMarkingEndOfToken } from './testIsMarkingEndOfToken.js';
import { testIsNumberLiteral } from './testIsNumberLiteral.js';
import { testIsStringLiteralStart } from './testIsStringLiteralStart.js';
import { testScan } from './testScan.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testScanning(logger) {
	wrapAndCall([
		testIsIdentifier,
		testIsMarkingEndOfToken,
		testIsNumberLiteral,
		testIsStringLiteralStart,
		testScan
	], logger);
};