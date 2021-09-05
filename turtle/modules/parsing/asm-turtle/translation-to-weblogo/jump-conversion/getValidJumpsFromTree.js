import { getDescendentsOfType } from '../../../generic-parsing-utilities/getDescendentsOfType.js';
import { Instruction } from '../../Instruction.js';
import { jumpToLabelName } from './jumpToLabelName.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

const jumpNames = new Set();
/*
It was tempting to hardcode the list of jump command names but the following
connects it better to the migration JSON file's data.
*/
for (const info of Instruction.getAllInstructionsInfo()) {
	const name = info.primaryName.toLowerCase();
	if (name.startsWith('j') &&
	info.args !== undefined &&
	info.args.length === 1 &&
	info.args[0].name.toLowerCase().indexOf('label') !== -1) {
		jumpNames.add(name);
	}
}

function isValidJump(token) {
	if (token.children.length !== 1)
		return false;
	if (!jumpNames.has(token.val.toLowerCase()))
		return false;
	if (token.children[0].type !== ParseTreeTokenType.LABEL)
		return false;
	return true;
}

function jumpHasMatchingLabel(labelNamesSet) {
	return function(jump) {
		return labelNamesSet.has(jumpToLabelName(jump));
	};
}

export function getValidJumpsFromTree(root) {
	const jumps = getDescendentsOfType(root, ParseTreeTokenType.INSTRUCTION).filter(isValidJump);
	if (jumps.length === 0)
		return [];
	const labels = getDescendentsOfType(root, ParseTreeTokenType.LABEL_ANCHOR);
	const labelNamesSet = new Set(labels.map(labelToken => labelToken.val.toLowerCase()));
	return jumps.filter(jumpHasMatchingLabel(labelNamesSet));
};