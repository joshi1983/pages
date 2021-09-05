import { testIsCompleteNumberLiteral } from './testIsCompleteNumberLiteral.js';
import { testIsMarkingEndOfToken } from './testIsMarkingEndOfToken.js';
import { testScan } from './testScan.js';
import { testScanExamples } from './testScanExamples.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testScanning(logger) {
	wrapAndCall([
		testIsCompleteNumberLiteral,
		testIsMarkingEndOfToken,
		testScan,
		testScanExamples,
	], logger);
};