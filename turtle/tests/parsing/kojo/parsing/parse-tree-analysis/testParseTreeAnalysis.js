import { testDataTypeTokenToString } from
'./testDataTypeTokenToString.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testParseTreeAnalysis(logger) {
	wrapAndCall([
		testDataTypeTokenToString
	], logger);
};