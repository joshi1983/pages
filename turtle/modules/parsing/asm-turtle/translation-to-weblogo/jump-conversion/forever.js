import { addChildrenUpTo } from './addChildrenUpTo.js';
import { isAfterOrSame } from '../../../generic-parsing-utilities/isAfterOrSame.js';
import { isAnySpecifiedTokenBetween } from '../../../generic-parsing-utilities/isAnySpecifiedTokenBetween.js';
import { isStrictlyAfter } from '../../../generic-parsing-utilities/isStrictlyAfter.js';
import { jumpToLabelName } from './jumpToLabelName.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

function isOfInterest(jumps, labelsMap) {
	return function(jump) {
		if (jump.val.toLowerCase() !== 'jmp')
			return false;
		const label = labelsMap.get(jumpToLabelName(jump));
		if (isStrictlyAfter(label, jump))
			return false;
		if (isAnySpecifiedTokenBetween(jumps, label, jump))
			return false;
		return true;
	};
}

export function forever(jumps, labelsMap, root) {
	const jumpsOfInterest = jumps.filter(isOfInterest(jumps, labelsMap));
	jumpsOfInterest.forEach(function(jumpToken) {
		const label = labelsMap.get(jumpToLabelName(jumpToken));
		label.type = ParseTreeTokenType.FOREVER;
		label.val = 'forever';
		label.removeAllChildren();
		jumpToken.remove();
		// add every token between the 2 as children of label.
		addChildrenUpTo(label, jumpToken);
	});
	return jumpsOfInterest.length !== 0;
};