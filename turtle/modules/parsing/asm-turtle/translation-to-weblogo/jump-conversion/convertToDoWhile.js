import { addChildrenUpTo } from './addChildrenUpTo.js';
import { filterJumpsTo } from './filterJumpsTo.js';
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
		if (isAfterOrSame(label, jump))
			return false;
		if (isAnySpecifiedTokenBetween(labelsMap.values(), jump, label)) {
			return false;
		}
		if (isAnySpecifiedTokenBetween(jumps, jump, label)) {
			return false;
		}
		return true;
	};
}

export function convertToDoWhile(jumps, labelsMap, root) {
	const jumpsOfInterest = jumps.filter(isOfInterest(jumps, labelsMap));
	jumpsOfInterest.forEach(function(jump) {
		let startToken = labelsMap.get(jumpToLabelName(jump));
		const jumpsToLabel = filterJumpsTo(jumps, startToken);
		if (jumpsToLabel.length > 1) {
			const prev = startToken;
			startToken = new ParseTreeToken('do.while', startToken.lineIndex, startToken.colIndex + 1, ParseTreeTokenType.DO_WHILE);
			prev.appendSibling(startToken);
		}
		else {
			startToken.type = ParseTreeTokenType.DO_WHILE;
			startToken.val = 'do.while';
			startToken.removeAllChildren(); // remove startToken.
		}
		startToken.jumpName = jump.val.toLowerCase();
		jump.remove();
		addChildrenUpTo(startToken, jump);
	});
	return jumpsOfInterest.length !== 0;
};