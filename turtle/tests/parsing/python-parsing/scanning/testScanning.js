import { testIsBytesLiteral } from './testIsBytesLiteral.js';
import { testIsBytesLiteralStart } from './testIsBytesLiteralStart.js';
import { testIsComplexNumberLiteral } from './testIsComplexNumberLiteral.js';
import { testIsDecoratorStart } from './testIsDecoratorStart.js';
import { testIsIdentifier } from './testIsIdentifier.js';
import { testIsMarkingEndOfToken } from './testIsMarkingEndOfToken.js';
import { testIsStartOfDocString } from './testIsStartOfDocString.js';
import { testScan } from './testScan.js';
import { testScanExamples } from './testScanExamples.js';
import { testTokenSanitizers } from './token-sanitizers/testTokenSanitizers.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testScanning(logger) {
	wrapAndCall([
		testIsBytesLiteral,
		testIsBytesLiteralStart,
		testIsComplexNumberLiteral,
		testIsDecoratorStart,
		testIsIdentifier,
		testIsMarkingEndOfToken,
		testIsStartOfDocString,
		testScan,
		testScanExamples,
		testTokenSanitizers
	], logger);
};