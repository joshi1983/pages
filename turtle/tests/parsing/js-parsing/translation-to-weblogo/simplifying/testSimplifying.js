import { testAddFunctionArgList } from './testAddFunctionArgList.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testSimplifying(logger) {
	wrapAndCall([
		testAddFunctionArgList
	], logger);
};