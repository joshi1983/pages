import { testIsBase10NumberLiteralStart } from './testIsBase10NumberLiteralStart.js';
import { testIsComment } from './testIsComment.js';
import { testIsHexNumberLiteralStart } from './testIsHexNumberLiteralStart.js';
import { testIsIdentifier } from './testIsIdentifier.js';
import { testIsMarkingEndOfToken } from './testIsMarkingEndOfToken.js';
import { testIsNumberLiteralStart } from './testIsNumberLiteralStart.js';
import { testIsPreprocessorIdentifier } from './testIsPreprocessorIdentifier.js';
import { testIsStartOfIdentifier } from './testIsStartOfIdentifier.js';
import { testIsStringLiteral } from './testIsStringLiteral.js';
import { testSanitizeTokens } from './testSanitizeTokens.js';
import { testScan } from './testScan.js';
import { testScanAllQBasicExamples } from './testScanAllQBasicExamples.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testScanning(logger) {
	wrapAndCall([
		testIsBase10NumberLiteralStart,
		testIsComment,
		testIsHexNumberLiteralStart,
		testIsIdentifier,
		testIsMarkingEndOfToken,
		testIsNumberLiteralStart,
		testIsPreprocessorIdentifier,
		testIsStartOfIdentifier,
		testIsStringLiteral,
		testSanitizeTokens,
		testScan,
		testScanAllQBasicExamples
	], logger);
};