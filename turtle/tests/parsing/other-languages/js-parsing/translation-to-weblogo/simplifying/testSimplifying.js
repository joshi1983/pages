import { testAddFunctionArgList } from './testAddFunctionArgList.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testSimplifying(logger) {
	return wrapAndCall([
		testAddFunctionArgList
	], logger);
};