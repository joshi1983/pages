import { testIsLikelyArrayVariableReference } from
'./testIsLikelyArrayVariableReference.js';
import { wrapAndCall } from
'../../../../../../../helpers/wrapAndCall.js';

export function testVariableDataTypes(logger) {
	wrapAndCall([
		testIsLikelyArrayVariableReference
	], logger);
};