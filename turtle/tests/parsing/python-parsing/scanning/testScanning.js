import { testIsBinaryNumberLiteralStart } from './testIsBinaryNumberLiteralStart.js';
import { testIsBytesLiteral } from './testIsBytesLiteral.js';
import { testIsBytesLiteralStart } from './testIsBytesLiteralStart.js';
import { testIsComplexNumberLiteral } from './testIsComplexNumberLiteral.js';
import { testIsDecoratorStart } from './testIsDecoratorStart.js';
import { testIsHexNumberLiteralStart } from './testIsHexNumberLiteralStart.js';
import { testIsIdentifier } from './testIsIdentifier.js';
import { testIsMarkingEndOfToken } from './testIsMarkingEndOfToken.js';
import { testIsOctalNumberLiteralStart } from './testIsOctalNumberLiteralStart.js';
import { testIsStartOfDocString } from './testIsStartOfDocString.js';
import { testScan } from './testScan.js';
import { testScanExamples } from './testScanExamples.js';
import { testTokenSanitizers } from './token-sanitizers/testTokenSanitizers.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testScanning(logger) {
	wrapAndCall([
		testIsBinaryNumberLiteralStart,
		testIsBytesLiteral,
		testIsBytesLiteralStart,
		testIsComplexNumberLiteral,
		testIsDecoratorStart,
		testIsHexNumberLiteralStart,
		testIsIdentifier,
		testIsMarkingEndOfToken,
		testIsOctalNumberLiteralStart,
		testIsStartOfDocString,
		testScan,
		testScanExamples,
		testTokenSanitizers
	], logger);
};