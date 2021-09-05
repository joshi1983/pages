import { testIsComment } from './testIsComment.js';
import { testIsCompleteNumberLiteral } from './testIsCompleteNumberLiteral.js';
import { testIsCompleteStringLiteral } from './testIsCompleteStringLiteral.js';
import { testIsIdentifier } from './testIsIdentifier.js';
import { testIsMarkingEndOfToken } from './testIsMarkingEndOfToken.js';
import { testIsNumberLiteral } from './testIsNumberLiteral.js';
import { testScan } from './testScan.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testScanning(logger) {
	wrapAndCall([
		testIsComment,
		testIsCompleteNumberLiteral,
		testIsCompleteStringLiteral,
		testIsIdentifier,
		testIsMarkingEndOfToken,
		testIsNumberLiteral,
		testScan
	], logger);
};