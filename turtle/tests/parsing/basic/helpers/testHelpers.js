import { testScanTokensToCode } from './testScanTokensToCode.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

export function testHelpers(logger) {
	wrapAndCall([
		testScanTokensToCode
	], logger);
};