import { testGetRequiredTypesFromStart } from
'./testGetRequiredTypesFromStart.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testRequiredTypes(logger) {
	wrapAndCall([
		testGetRequiredTypesFromStart
	], logger);
};