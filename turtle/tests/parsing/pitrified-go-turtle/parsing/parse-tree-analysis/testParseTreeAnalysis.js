import { testGetImportedPathsFrom } from './testGetImportedPathsFrom.js';
import { testTypesTokenToString } from './testTypesTokenToString.js';
import { testVariableDataTypes } from './variable-data-types/testVariableDataTypes.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testParseTreeAnalysis(logger) {
	wrapAndCall([
		testGetImportedPathsFrom,
		testTypesTokenToString,
		testVariableDataTypes
	], logger);
};