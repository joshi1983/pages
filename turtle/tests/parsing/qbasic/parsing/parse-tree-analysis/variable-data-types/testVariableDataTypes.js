import { testGetRequiredTypesForVariableAtToken } from
'./testGetRequiredTypesForVariableAtToken.js';
import { testGetRequiredTypesIn } from
'./testGetRequiredTypesIn.js';
import { testIsNumberToken } from
'./testIsNumberToken.js';
import { testIsStringToken } from
'./testIsStringToken.js';
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
		testIsNumberToken,
		testIsStringToken,
		testMightAssignNewValue,
		testMightBeString,
	], logger);
};