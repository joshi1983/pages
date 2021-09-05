import { testGetRequiredTypesForVariableAtToken } from
'./testGetRequiredTypesForVariableAtToken.js';
import { testGetRequiredTypesIn } from
'./testGetRequiredTypesIn.js';
import { testIsArrayToken } from
'./testIsArrayToken.js';
import { testIsNumberToken } from
'./testIsNumberToken.js';
import { testIsStringToken } from
'./testIsStringToken.js';
import { testMightAssignNewValue } from
'./testMightAssignNewValue.js';
import { testMightBeString } from
'./testMightBeString.js';
import { testVariables } from
'./variables/testVariables.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testVariableDataTypes(logger) {
	wrapAndCall([
		testGetRequiredTypesForVariableAtToken,
		testGetRequiredTypesIn,
		testIsArrayToken,
		testIsNumberToken,
		testIsStringToken,
		testMightAssignNewValue,
		testMightBeString,
		testVariables
	], logger);
};