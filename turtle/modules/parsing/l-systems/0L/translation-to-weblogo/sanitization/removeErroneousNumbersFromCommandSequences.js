import { getDescendentsOfType } from
'../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

function isOfInterest(token) {
	const parent = token.parentNode;
	if (parent.type !== ParseTreeTokenType.COMMAND_SEQUENCE)
		return false;
	const prev = token.getPreviousSibling();
	if (prev === null)
		return true;

	// FIXME: if a non-integer is applied to command symbols requiring integers, return true.

	return false;
}

export function removeErroneousNumbersFromCommandSequences(root) {
	const numbers = getDescendentsOfType(root, ParseTreeTokenType.NUMBER_LITERAL).filter(isOfInterest);
	numbers.forEach(t => t.remove());
};