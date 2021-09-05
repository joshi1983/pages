import { testGetUncalledProceduresFromCode } from './testGetUncalledProceduresFromCode.js';
import { testRemoveUnusedProceduresFromCode } from './testRemoveUnusedProceduresFromCode.js';
import { wrapAndCall } from '../../../../../helpers/wrapAndCall.js';

export function testCodeRemoval(logger) {
	wrapAndCall([
		testGetUncalledProceduresFromCode,
		testRemoveUnusedProceduresFromCode,
	], logger);
};