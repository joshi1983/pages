import { testGetFuncNamesThatDoNotBeginFills } from
'./testGetFuncNamesThatDoNotBeginFills.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testHelpers(logger) {
	wrapAndCall([
		testGetFuncNamesThatDoNotBeginFills
	], logger);
};