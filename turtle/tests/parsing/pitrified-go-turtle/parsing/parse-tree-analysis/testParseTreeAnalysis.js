import { testGetImportedPathsFrom } from './testGetImportedPathsFrom.js';
import { testVariableDataTypes } from './variable-data-types/testVariableDataTypes.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testParseTreeAnalysis(logger) {
	wrapAndCall([
		testGetImportedPathsFrom,
		testVariableDataTypes
	], logger);
};