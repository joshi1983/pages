import { addChildrenUpTo } from './addChildrenUpTo.js';
import { isAfterOrSame } from '../../../generic-parsing-utilities/isAfterOrSame.js';
import { isAnySpecifiedTokenBetween } from '../../../generic-parsing-utilities/isAnySpecifiedTokenBetween.js';
import { isStrictlyAfter } from '../../../generic-parsing-utilities/isStrictlyAfter.js';
import { jumpToLabelName } from './jumpToLabelName.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

function getJumpBetween(jumps, topJump, bottomLabel, aboveLabelName) {
	const jumpsBetween = [];
	for (const jumpB of jumps) {
		if (isStrictlyAfter(bottomLabel, jumpB) && isStrictlyAfter(jumpB, topJump)) {
			jumpsBetween.push(jumpB);
		}
	}
	if (jumpsBetween.length !== 1)
		return;
	if (jumpsBetween[0].val.toLowerCase() !== 'jmp')
		return;
	const result = jumpsBetween[0];
	const next = result.getNextSibling();
	if (next !== bottomLabel)
		return;
	const resultLabelName = jumpToLabelName(result);
	if (resultLabelName !== aboveLabelName)
		return;
	return result;
}

function isOfInterest(jumps, labelsMap) {
	return function(jump) {
		if (jump.val.toLowerCase() === 'jmp')
			return false;
		const prev = jump.getPreviousSibling();
		if (prev === null || prev.type !== ParseTreeTokenType.LABEL_ANCHOR)
			return false;
		const label = labelsMap.get(jumpToLabelName(jump));
		if (isAfterOrSame(jump, label))
			return false;
		if (isAnySpecifiedTokenBetween(labelsMap.values(), jump, label)) {
			return false;
		}
		return getJumpBetween(jumps, jump, label, prev.val.toLowerCase()) !== undefined;
	};
}

export function convertToWhile(jumps, labelsMap, root) {
	const jumpsOfInterest = jumps.filter(isOfInterest(jumps, labelsMap));
	jumpsOfInterest.forEach(function(jump) {
		const label = labelsMap.get(jumpToLabelName(jump));
		const aboveLabelName = jump.getPreviousSibling().val.toLowerCase();
		const jumpUp = getJumpBetween(jumps, jump, label, aboveLabelName);
		jump.jumpName = jump.val;
		jump.type = ParseTreeTokenType.WHILE;
		jump.val = 'while';
		jump.removeAllChildren(); // remove label.
		jumpUp.remove();
		addChildrenUpTo(jump, jumpUp);
	});
	return jumpsOfInterest.length !== 0;
};