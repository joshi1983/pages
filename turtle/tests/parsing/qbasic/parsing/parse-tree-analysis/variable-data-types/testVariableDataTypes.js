import { testGetRequiredTypesForVariableAtToken } from
'./testGetRequiredTypesForVariableAtToken.js';
import { testGetRequiredTypesIn } from
'./testGetRequiredTypesIn.js';
import { testMightAssignNewValue } from
'./testMightAssignNewValue.js';
import { testMightBeString } from
'./testMightBeString.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testVariableDataTypes(logger) {
	wrapAndCall([
		testGetRequiredTypesForVariableAtToken,
		testGetRequiredTypesIn,
		testMightAssignNewValue,
		testMightBeString,
	], logger);
};