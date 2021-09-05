import { testContainsIndirectMakeOrLocalmake } from './testContainsIndirectMakeOrLocalmake.js';
import { testGetLocalVariablesVariable } from './testGetLocalVariablesVariable.js';
import { testGetNewVariableNamesFor } from './testGetNewVariableNamesFor.js';
import { testGetUnsafeIdentifiers } from './testGetUnsafeIdentifiers.js';
import { testGetVariableCountsFromParseTree } from './testGetVariableCountsFromParseTree.js';
import { testGetWebLogoVariablesFromJS } from './testGetWebLogoVariablesFromJS.js';
import { testInitializeLocalVariables } from './testInitializeLocalVariables.js';
import { testIsNeedingToMoveDeclarations } from './testIsNeedingToMoveDeclarations.js';
import { testMoveVariableDeclarationsToStart } from './testMoveVariableDeclarationsToStart.js';
import { testNeedsEndingMake } from './testNeedsEndingMake.js';
import { testRemoveLocalVariablesDeclarations } from './testRemoveLocalVariablesDeclarations.js';
import { testShouldInitializeLocalVariables } from './testShouldInitializeLocalVariables.js';
import { wrapAndCall } from '../../../../../../helpers/wrapAndCall.js';

export function testOptimizeVariableAccess(logger) {
	wrapAndCall([
		testContainsIndirectMakeOrLocalmake,
		testGetLocalVariablesVariable,
		testGetNewVariableNamesFor,
		testGetUnsafeIdentifiers,
		testGetVariableCountsFromParseTree,
		testGetWebLogoVariablesFromJS,
		testInitializeLocalVariables,
		testIsNeedingToMoveDeclarations,
		testMoveVariableDeclarationsToStart,
		testNeedsEndingMake,
		testRemoveLocalVariablesDeclarations,
		testShouldInitializeLocalVariables
	], logger);
};