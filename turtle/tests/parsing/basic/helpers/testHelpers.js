import { testInsertSpacesAfterIntegerLabels } from './testInsertSpacesAfterIntegerLabels.js';
import { testScanTokensToCode } from './testScanTokensToCode.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

export function testHelpers(logger) {
	wrapAndCall([
		testInsertSpacesAfterIntegerLabels,
		testScanTokensToCode
	], logger);
};