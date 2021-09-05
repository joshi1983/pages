import { testIsBase10NumberLiteralStart } from './testIsBase10NumberLiteralStart.js';
import { testIsComment } from './testIsComment.js';
import { testIsCompleteNumberLiteral } from './testIsCompleteNumberLiteral.js';
import { testIsHexNumberLiteralStart } from './testIsHexNumberLiteralStart.js';
import { testIsIdentifier } from './testIsIdentifier.js';
import { testIsMarkingEndOfToken } from './testIsMarkingEndOfToken.js';
import { testIsNumberLiteralStart } from './testIsNumberLiteralStart.js';
import { testIsOctalNumberLiteralStart } from './testIsOctalNumberLiteralStart.js';
import { testIsPreprocessorIdentifier } from './testIsPreprocessorIdentifier.js';
import { testIsREMComment } from './testIsREMComment.js';
import { testIsStartOfIdentifier } from './testIsStartOfIdentifier.js';
import { testIsStringLiteral } from './testIsStringLiteral.js';
import { testSanitizeTokens } from './testSanitizeTokens.js';
import { testScan } from './testScan.js';
import { testScanAllQBasicExamples } from './testScanAllQBasicExamples.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testScanning(logger) {
	wrapAndCall([
		testIsBase10NumberLiteralStart,
		testIsComment,
		testIsCompleteNumberLiteral,
		testIsHexNumberLiteralStart,
		testIsIdentifier,
		testIsMarkingEndOfToken,
		testIsNumberLiteralStart,
		testIsOctalNumberLiteralStart,
		testIsPreprocessorIdentifier,
		testIsREMComment,
		testIsStartOfIdentifier,
		testIsStringLiteral,
		testSanitizeTokens,
		testScan,
		testScanAllQBasicExamples
	], logger);
};