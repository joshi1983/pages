import { testCanBeCompleteRegularExpressionPattern } from './testCanBeCompleteRegularExpressionPattern.js';
import { testIsCommentPrefix } from './testIsCommentPrefix.js';
import { testIsCompleteComment } from './testIsCompleteComment.js';
import { testIsCompleteNumberLiteral } from './testIsCompleteNumberLiteral.js';
import { testIsCompleteRegularExpression } from './testIsCompleteRegularExpression.js';
import { testIsCompleteStringLiteral } from './testIsCompleteStringLiteral.js';
import { testIsCompleteTemplateLiteral } from './testIsCompleteTemplateLiteral.js';
import { testIsMarkingEndOfToken } from './testIsMarkingEndOfToken.js';
import { testIsStartingNumberLiteral } from './testIsStartingNumberLiteral.js';
import { testIsStartingRegularExpression } from './testIsStartingRegularExpression.js';
import { testIsTrailMarkingEndOfToken } from './testIsTrailMarkingEndOfToken.js';
import { testIsValidIdentifier } from './testIsValidIdentifier.js';
import { testScan } from './testScan.js';
import { testScanFinalTokenString } from './testScanFinalTokenString.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testScanning(logger) {
	wrapAndCall([
		testCanBeCompleteRegularExpressionPattern,
		testIsCommentPrefix,
		testIsCompleteComment,
		testIsCompleteNumberLiteral,
		testIsCompleteRegularExpression,
		testIsCompleteStringLiteral,
		testIsCompleteTemplateLiteral,
		testIsMarkingEndOfToken,
		testIsStartingNumberLiteral,
		testIsStartingRegularExpression,
		testIsTrailMarkingEndOfToken,
		testIsValidIdentifier,
		testScan,
		testScanFinalTokenString
	], logger);
};