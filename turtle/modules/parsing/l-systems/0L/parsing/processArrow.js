import { ParseTreeToken } from
'../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

function shouldAddPrevious(prev) {
	if (prev.type !== ParseTreeTokenType.IDENTIFIER &&
	prev.type !== ParseTreeTokenType.COMPOSITE_IDENTIFIER)
		return false;

	return true;
}

export function processArrow(prev, next) {
	if (shouldAddPrevious(prev)) {
		const prevParent = prev.parentNode;
		prevParent.replaceChild(prev, next);
		next.appendChild(prev);
		const commandSequence = new ParseTreeToken(null, next.lineIndex, next.colIndex, ParseTreeTokenType.COMMAND_SEQUENCE);
		next.appendChild(commandSequence);
		return commandSequence;
	}
	else {
		prev.appendChild(next);
	}
	return next;
};