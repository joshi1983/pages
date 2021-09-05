import { convertToDoWhile } from './convertToDoWhile.js';
import { convertToIf } from './convertToIf.js';
import { convertToIfElse } from './convertToIfElse.js';
import { convertToWhile } from './convertToWhile.js';
import { forever } from './forever.js';
import { getLabelsMapFromTree } from './getLabelsMapFromTree.js';
import { getValidJumpsFromTree } from './getValidJumpsFromTree.js';
import { removeJumpsOverProcedures } from './removeJumpsOverProcedures.js';
import { removeSkippedCode } from './removeSkippedCode.js';

const converters = [
convertToDoWhile, convertToIf, convertToIfElse, convertToWhile, forever,
removeJumpsOverProcedures, removeSkippedCode];

export function convertJumps(root) {
	let jumps;
	let labelsMap;
	function refreshJumpsAndLabels() {
		jumps = getValidJumpsFromTree(root);
		labelsMap = getLabelsMapFromTree(root, jumps);
	}
	refreshJumpsAndLabels();
	let isContinuing = true;
	while (isContinuing) {
		isContinuing = false;
		for (const converter of converters) {
			const result = converter(jumps, labelsMap, root);
			if (result) {
				refreshJumpsAndLabels();
			}
			isContinuing = isContinuing || result;
		}
	}
};