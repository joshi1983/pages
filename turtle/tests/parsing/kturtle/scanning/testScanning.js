import { testIsCompleteKTurtleVersion } from './testIsCompleteKTurtleVersion.js';
import { testIsNumberLiteral } from './testIsNumberLiteral.js';
import { testIsStartOfKTurtleVersion } from './testIsStartOfKturtleVersion.js';
import { testIsValidIdentifier } from './testIsValidIdentifier.js';
import { testScan } from './testScan.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testScanning(logger) {
	wrapAndCall([
		testIsCompleteKTurtleVersion,
		testIsNumberLiteral,
		testIsStartOfKTurtleVersion,
		testIsValidIdentifier,
		testScan,
	], logger);
};