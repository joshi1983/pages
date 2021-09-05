import { testOptimizeWithConstantColours } from './testOptimizeWithConstantColours.js';
import { testRemoveTrailingLocalSetCalls } from './testRemoveTrailingLocalSetCalls.js';
import { testRemoveUnneededInitialVariableReads } from './testRemoveUnneededInitialVariableReads.js';
import { wrapAndCall } from '../../../../../../helpers/wrapAndCall.js';

export function testFinalOptimize(logger) {
	wrapAndCall([
		testOptimizeWithConstantColours,
		testRemoveTrailingLocalSetCalls,
		testRemoveUnneededInitialVariableReads
	], logger);
};