import { testIsCompleteCharacterLiteral } from './testIsCompleteCharacterLiteral.js';
import { testIsCompleteNumberLiteral } from './testIsCompleteNumberLiteral.js';
import { testIsCompleteStringLiteral } from './testIsCompleteStringLiteral.js';
import { testIsFloatingPointLiteralStart } from './testIsFloatingPointLiteralStart.js';
import { testIsIdentifier } from './testIsIdentifier.js';
import { testIsImaginaryNumberLiteral } from './testIsImaginaryNumberLiteral.js';
import { testIsMarkingEndOfToken } from './testIsMarkingEndOfToken.js';
import { testScan } from './testScan.js';
import { testScanValidNumberLiterals } from './testScanValidNumberLiterals.js';
import { testScanVariousExamples } from './testScanVariousExamples.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testScanning(logger) {
	wrapAndCall([
		testIsCompleteCharacterLiteral,
		testIsCompleteNumberLiteral,
		testIsCompleteStringLiteral,
		testIsIdentifier,
		testIsImaginaryNumberLiteral,
		testIsMarkingEndOfToken,
		testIsFloatingPointLiteralStart,
		testScan,
		testScanValidNumberLiterals,
		testScanVariousExamples,
	], logger);
};