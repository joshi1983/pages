import { testIsCommentPrefix } from './testIsCommentPrefix.js';
import { testIsCompleteComment } from './testIsCompleteComment.js';
import { testIsCompleteNumberLiteral } from './testIsCompleteNumberLiteral.js';
import { testIsMarkingEndOfToken } from './testIsMarkingEndOfToken.js';
import { testIsStartingNumberLiteral } from './testIsStartingNumberLiteral.js';
import { testIsTrailMarkingEndOfToken } from './testIsTrailMarkingEndOfToken.js';
import { testScan } from './testScan.js';
import { testScanExamples } from './testScanExamples.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testScanning(logger) {
	wrapAndCall([
		testIsCommentPrefix,
		testIsCompleteComment,
		testIsCompleteNumberLiteral,
		testIsMarkingEndOfToken,
		testIsStartingNumberLiteral,
		testIsTrailMarkingEndOfToken,
		testScan,
		testScanExamples
	], logger);
};