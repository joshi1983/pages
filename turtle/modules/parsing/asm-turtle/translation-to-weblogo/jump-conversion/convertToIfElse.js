import { addChildrenUpTo } from './addChildrenUpTo.js';
import { isAfterOrSame } from '../../../generic-parsing-utilities/isAfterOrSame.js';
import { isAnySpecifiedTokenBetween } from '../../../generic-parsing-utilities/isAnySpecifiedTokenBetween.js';
import { isStrictlyAfter } from '../../../generic-parsing-utilities/isStrictlyAfter.js';
import { jumpToLabelName } from './jumpToLabelName.js';
import { ParseTreeToken } from '../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

function getJumpToEndIfElse(jumps, from, to) {
	let result;
	for (const jump of jumps) {
		if (isStrictlyAfter(jump, from) && isStrictlyAfter(to, jump)) {
			if (jump.val.toLowerCase() !== 'jmp')
				return;
			if (result !== undefined)
				return; // too many jumps found to be suitable for if-else.
			result = jump;
		}
	}
	return result;
}

function isOfInterest(jumps, labelsMap) {
	return function(jump) {
		if (jump.val.toLowerCase() === 'jmp')
			return false;
		const label = labelsMap.get(jumpToLabelName(jump));
		if (isAfterOrSame(jump, label))
			return false;
		const jmpToEnd = getJumpToEndIfElse(jumps, jump, label);
		if (jmpToEnd === undefined)
			return false;
		const endIfElseLabel = labelsMap.get(jumpToLabelName(jmpToEnd));
		if (isAfterOrSame(jmpToEnd, endIfElseLabel))
			return false;
		if (isAnySpecifiedTokenBetween(jumps, label, endIfElseLabel))
			return false;
		return true;
	};
}

export function convertToIfElse(jumps, labelsMap, root) {
	const jumpsOfInterest = jumps.filter(isOfInterest(jumps, labelsMap));
	jumpsOfInterest.forEach(function(jumpToken) {
		const middleLabel = labelsMap.get(jumpToLabelName(jumpToken));
		const middleJump = getJumpToEndIfElse(jumps, jumpToken, middleLabel);
		const endLabel = labelsMap.get(jumpToLabelName(middleJump));
		middleJump.remove();
		jumpToken.jumpName = jumpToken.val.toLowerCase();
		jumpToken.val = 'ifelse';
		jumpToken.type = ParseTreeTokenType.IF_ELSE;
		const ifChild = jumpToken.children[0];
		ifChild.type = ParseTreeTokenType.INSTRUCTION_LIST;
		ifChild.val = '';
		ifChild.removeAllChildren();
		addChildrenUpTo(jumpToken, middleLabel);
		for (let i = 0; i < jumpToken.children.length; i++) {
			const child = jumpToken.children[i];
			if (child !== ifChild) {
				child.remove();
				ifChild.appendChild(child);
				i--;
			}
		}
		middleLabel.type = ParseTreeTokenType.INSTRUCTION_LIST;
		middleLabel.val = '';
		middleLabel.removeAllChildren();
		addChildrenUpTo(middleLabel, endLabel);
		jumpToken.appendChild(middleLabel);
	});
	return jumpsOfInterest.length !== 0;
};