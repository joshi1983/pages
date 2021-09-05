import { getDescendentsOfType } from '../../../generic-parsing-utilities/getDescendentsOfType.js';
import { jumpToLabelName } from './jumpToLabelName.js';
import { isAfterOrSame } from '../../../generic-parsing-utilities/isAfterOrSame.js';
import { isAnySpecifiedTokenBetween } from '../../../generic-parsing-utilities/isAnySpecifiedTokenBetween.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

function isOfInterest(labelsMap, root) {
	const procs = getDescendentsOfType(root, ParseTreeTokenType.PROC_START);
	return function(jump) {
		if (jump.val.toLowerCase() !== 'jmp' || jump.children.length !== 1)
			return false;
		const labelName = jumpToLabelName(jump);
		const label = labelsMap.get(labelName);
		if (isAfterOrSame(jump, label))
			return false;
		if (isAnySpecifiedTokenBetween(labelsMap.values(), jump, label)) {
			return false;
		}
		if (isAnySpecifiedTokenBetween(procs, jump, label)) {
			return false;
		}
		return true;
	};
}

export function removeSkippedCode(jumps, labelsMap, root) {
	const jumpsOfInterest = jumps.filter(isOfInterest(labelsMap, root));
	jumpsOfInterest.forEach(function(jump) {
		const label = labelsMap.get(jumpToLabelName(jump));
		const children = jump.parentNode.children;
		const index = children.indexOf(jump);
		while (index < children.length && isAfterOrSame(label, children[index])) {
			children[index].remove();
		}
	});
	return jumpsOfInterest.length !== 0;
};