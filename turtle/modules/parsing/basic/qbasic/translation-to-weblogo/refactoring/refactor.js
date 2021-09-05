import { addEndIf } from './addEndIf.js';
import { addThen } from './addThen.js';
import { removeGotoSkippedSections } from
'./removeGotoSkippedSections.js';
import { removeTrivialGotoInfiniteLoops } from
'./removeTrivialGotoInfiniteLoops.js';
import { removeUnconditionalIfStatements } from
'./removeUnconditionalIfStatements.js';
import { removeUnreferencedLabels } from
'./removeUnreferencedLabels.js';
import { replaceDoWhileLoopWithWhileWend } from
'./replaceDoWhileLoopWithWhileWend.js';
import { whileGotoToIf } from
'./whileGotoToIf.js';

const refactorers = [
	addEndIf,
	addThen,
	removeGotoSkippedSections,
	removeTrivialGotoInfiniteLoops,
	removeUnconditionalIfStatements,
	removeUnreferencedLabels,
	replaceDoWhileLoopWithWhileWend,
	whileGotoToIf
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