import { testGetReturnDataTypesFromInputs } from
'./testGetReturnDataTypesFromInputs.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testOperatorDataTypes(logger) {
	wrapAndCall([
		testGetReturnDataTypesFromInputs,
	], logger);
};