import { addEndIf } from './addEndIf.js';
import { addThen } from './addThen.js';
import { exitWhileToIf } from './exitWhileToIf.js';
import { gotoToDoLoopWhile } from './gotoToDoLoopWhile.js';
import { gotoToExitLoops } from './gotoToExitLoops.js';
import { gotoToInfiniteLoops } from './gotoToInfiniteLoops.js';
import { mergeNeighbouringLabels } from './mergeNeighbouringLabels.js';
import { removeGotoSkippedSections } from
'./removeGotoSkippedSections.js';
import { removeRedundantScreenCalls } from './removeRedundantScreenCalls.js';
import { removeTrivialInfiniteLoops } from
'./removeTrivialInfiniteLoops.js';
import { removeUnconditionalIfStatements } from
'./removeUnconditionalIfStatements.js';
import { removeUnreferencedLabels } from
'./removeUnreferencedLabels.js';
import { replaceDoWhileLoopWithWhileWend } from
'./replaceDoWhileLoopWithWhileWend.js';

const refactorers = [
	addEndIf,
	addThen,
	exitWhileToIf,
	gotoToDoLoopWhile,
	gotoToExitLoops,
	gotoToInfiniteLoops,
	mergeNeighbouringLabels,
	removeGotoSkippedSections,
	removeRedundantScreenCalls,
	removeTrivialInfiniteLoops,
	removeUnconditionalIfStatements,
	removeUnreferencedLabels,
	replaceDoWhileLoopWithWhileWend,
];

/*
refactor simplifies the QBasic parse tree in ways 
that won't hurt the translation to WebLogo.

Removing unimportant parts of the parse tree should
help the rest of the translation code generate simpler and shorter WebLogo code.
*/
export function refactor(root) {
	let keepLooping = true;
	while (keepLooping) {
		keepLooping = false;
		for (const refactorer of refactorers) {
			keepLooping = keepLooping || refactorer(root);
		}
	}
};