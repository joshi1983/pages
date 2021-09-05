import { testIsHexNumberLiteral } from './testIsHexNumberLiteral.js';
import { testIsHexToStringLiteral } from './testIsHexToStringLiteral.js';
import { testScan } from './testScan.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testScanning(logger) {
	wrapAndCall([
		testIsHexNumberLiteral,
		testIsHexToStringLiteral,
		testScan
	], logger);
};