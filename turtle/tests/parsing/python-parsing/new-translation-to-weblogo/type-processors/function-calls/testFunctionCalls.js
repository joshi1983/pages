import { testIsLikelyOnPackage } from
'./testIsLikelyOnPackage.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testFunctionCalls(logger) {
	wrapAndCall([
		testIsLikelyOnPackage
	], logger);
};