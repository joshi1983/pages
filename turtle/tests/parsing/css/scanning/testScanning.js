import { testIsCommentComplete } from './testIsCommentComplete.js';
import { testIsCompleteIdentifier } from './testIsCompleteIdentifier.js';
import { testIsIdentifierStart } from './testIsIdentifierStart.js';
import { testIsMarkingEndOfToken } from './testIsMarkingEndOfToken.js';
import { testIsNumberLengthUnitLiteral } from './testIsNumberLengthUnitLiteral.js';
import { testIsNumberUnitLiteral } from './testIsNumberUnitLiteral.js';
import { testIsQuotedStringLiteralStart } from './testIsQuotedStringLiteralStart.js';
import { testIsStartOfPseudoClass } from './testIsStartOfPseudoClass.js';
import { testIsStringLiteralStart } from './testIsStringLiteralStart.js';
import { testScan } from './testScan.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testScanning(logger) {
	wrapAndCall([
		testIsCommentComplete,
		testIsCompleteIdentifier,
		testIsIdentifierStart,
		testIsMarkingEndOfToken,
		testIsNumberLengthUnitLiteral,
		testIsNumberUnitLiteral,
		testIsQuotedStringLiteralStart,
		testIsStartOfPseudoClass,
		testIsStringLiteralStart,
		testScan
	], logger);
};