import { testGetCommonType } from
'./testGetCommonType.js';
import { testGetDataTypeString } from
'./testGetDataTypeString.js';
import { testGetTypeFromValue } from
'./testGetTypeFromValue.js';
import { testIsPropertyToken } from
'./testIsPropertyToken.js';
import { testNewChildTokenToDataTypeString } from
'./testNewChildTokenToDataTypeString.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testVariableDataTypes(logger) {
	wrapAndCall([
		testGetCommonType,
		testGetDataTypeString,
		testGetTypeFromValue,
		testIsPropertyToken,
		testNewChildTokenToDataTypeString,
	], logger);
};