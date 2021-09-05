import { testGetDataTypeString } from
'./testGetDataTypeString.js';
import { testGetTypeFromValue } from
'./testGetTypeFromValue.js';
import { testIsPropertyToken } from
'./testIsPropertyToken.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testVariableDataTypes(logger) {
	wrapAndCall([
		testGetDataTypeString,
		testGetTypeFromValue,
		testIsPropertyToken
	], logger);
};