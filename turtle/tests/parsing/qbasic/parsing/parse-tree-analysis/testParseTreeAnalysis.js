import { testVariableDataTypes } from
'./variable-data-types/testVariableDataTypes.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testParseTreeAnalysis(logger) {
	wrapAndCall([
		testVariableDataTypes
	], logger);
};