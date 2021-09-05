import { testIsCompleteNumberLiteral } from './testIsCompleteNumberLiteral.js';
import { testIsFloatingPointLiteralStart } from './testIsFloatingPointLiteralStart.js';
import { testIsIdentifier } from './testIsIdentifier.js';
import { testIsImaginaryNumberLiteral } from './testIsImaginaryNumberLiteral.js';
import { testScan } from './testScan.js';
import { testScanValidNumberLiterals } from './testScanValidNumberLiterals.js';
import { testScanVariousExamples } from './testScanVariousExamples.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testScanning(logger) {
	wrapAndCall([
		testIsCompleteNumberLiteral,
		testIsIdentifier,
		testIsImaginaryNumberLiteral,
		testIsFloatingPointLiteralStart,
		testScan,
		testScanValidNumberLiterals,
		testScanVariousExamples,
	], logger);
};