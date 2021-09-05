import { addChildrenUpTo } from './addChildrenUpTo.js';
import { isAfterOrSame } from '../../../generic-parsing-utilities/isAfterOrSame.js';
import { isAnySpecifiedTokenBetween } from '../../../generic-parsing-utilities/isAnySpecifiedTokenBetween.js';
import { jumpToLabelName } from './jumpToLabelName.js';
import { ParseTreeToken } from '../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

function isOfInterest(jumps, labelsMap) {
	return function(jump) {
		if (jump.val.toLowerCase() === 'jmp')
			return false;
		const label = labelsMap.get(jumpToLabelName(jump));
		if (isAfterOrSame(jump, label))
			return false;
		if (isAnySpecifiedTokenBetween(jumps, label, jump))
			return false;
		return true;
	};
}

export function convertToIf(jumps, labelsMap, root) {
	const jumpsOfInterest = jumps.filter(isOfInterest(jumps, labelsMap));
	jumpsOfInterest.forEach(function(jumpToken) {
		const label = labelsMap.get(jumpToLabelName(jumpToken));
		const ifToken = new ParseTreeToken('if', jumpToken.lineIndex, jumpToken.colIndex, ParseTreeTokenType.IF);
		jumpToken.parentNode.replaceChild(jumpToken, ifToken);
		jumpToken.remove();
		ifToken.jumpName = jumpToken.val.toLowerCase();
		// add every token between the 2 as children of label.
		addChildrenUpTo(ifToken, label);
	});
	return jumpsOfInterest.length !== 0;
};