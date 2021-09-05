import { testAddEndIf } from './testAddEndIf.js';
import { testAddThen } from './testAddThen.js';
import { testExitWhileToIf } from './testExitWhileToIf.js';
import { testGotoToDoLoopWhile } from
'./testGotoToDoLoopWhile.js';
import { testGotoToExitLoops } from
'./testGotoToExitLoops.js';
import { testGotoToInfiniteLoops } from
'./testGotoToInfiniteLoops.js';
import { testMergeNeighbouringLabels } from
'./testMergeNeighbouringLabels.js';
import { testRemoveGotoSkippedSections } from
'./testRemoveGotoSkippedSections.js';
import { testRemoveRedundantScreenCalls } from
'./testRemoveRedundantScreenCalls.js';
import { testRemoveTrivialInfiniteLoops } from
'./testRemoveTrivialInfiniteLoops.js';
import { testRemoveUnconditionalIfStatements } from
'./testRemoveUnconditionalIfStatements.js';
import { testRemoveUnreferencedLabels } from
'./testRemoveUnreferencedLabels.js';
import { testReplaceDoWhileLoopWithWhileWend } from
'./testReplaceDoWhileLoopWithWhileWend.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testRefactoring(logger) {
	wrapAndCall([
		testAddEndIf,
		testAddThen,
		testExitWhileToIf,
		testGotoToDoLoopWhile,
		testGotoToExitLoops,
		testGotoToInfiniteLoops,
		testMergeNeighbouringLabels,
		testRemoveGotoSkippedSections,
		testRemoveRedundantScreenCalls,
		testRemoveTrivialInfiniteLoops,
		testRemoveUnconditionalIfStatements,
		testRemoveUnreferencedLabels,
		testReplaceDoWhileLoopWithWhileWend
	], logger);
};