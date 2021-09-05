import { prefixWrapper } from '../../../../../helpers/prefixWrapper.js';
import { testGetUncalledProceduresFromCode } from './testGetUncalledProceduresFromCode.js';
import { testRemoveUnusedProceduresFromCode } from './testRemoveUnusedProceduresFromCode.js';

export function testCodeRemoval(logger) {
	testGetUncalledProceduresFromCode(prefixWrapper('testGetUncalledProceduresFromCode', logger));
	testRemoveUnusedProceduresFromCode(prefixWrapper('testRemoveUnusedProceduresFromCode', logger));
};