import { isStrictlyAfter } from '../../../generic-parsing-utilities/isStrictlyAfter.js';
import { jumpToLabelName } from './jumpToLabelName.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

function isOfInterest(labelsMap) {
	return function(jump) {
		if (jump.val.toLowerCase() !== 'jmp')
			return false;
		const label = labelsMap.get(jumpToLabelName(jump));
		if (isStrictlyAfter(jump, label))
			return false;
		const children = jump.parentNode.children;
		let index = children.indexOf(jump) + 1;
		for (; index < children.length; index++) {
			const child = children[index];
			if (label === child || isStrictlyAfter(child, label))
				return true;
			if (child.type !== ParseTreeTokenType.PROC_START)
				return false;
		}
		return false;
	};
}

export function removeJumpsOverProcedures(jumps, labelsMap, root) {
	const jumpsOfInterest = jumps.filter(isOfInterest(labelsMap));
	jumpsOfInterest.forEach(function(jump) {
		const label = labelsMap.get(jumpToLabelName(jump));
		jump.remove();
	});
	return jumpsOfInterest.length !== 0;
};