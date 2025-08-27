import { getDescendentsOfType } from
'../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { getLastDescendentTokenOf } from
'../../../../generic-parsing-utilities/getLastDescendentTokenOf.js';
import { ParseTreeToken } from
'../../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

function isOfInterest(token) {
	const nameToken = token.children[0];
	if (nameToken === undefined || nameToken.type !== ParseTreeTokenType.IDENTIFIER ||
	nameToken.val.toLowerCase() !== 'goto')
		return false;
	const parent = token.parentNode;
	if (parent.type !== ParseTreeTokenType.CODE_BLOCK)
		return false;
	const grandParent = parent.parentNode;
	if (grandParent.type !== ParseTreeTokenType.IF)
		return false;
	
	return true;
}

export function gotoToDoLoopWhile(root) {
	const gotos = getDescendentsOfType(root, ParseTreeTokenType.FUNCTION_CALL).
		filter(isOfInterest);
	
};