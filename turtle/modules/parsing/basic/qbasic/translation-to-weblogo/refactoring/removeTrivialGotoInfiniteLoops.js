import { getDescendentsOfType } from
'../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

function getPreviousLabel(token) {
	token = token.getPreviousSibling();
	if (token === null || token.type !== ParseTreeTokenType.LABEL)
		return null;
	return token;
}

function isOfInterest(token) {
	const nameToken = token.children[0];
	if (nameToken === undefined)
		return false;
	if (nameToken.val === null || nameToken.val.toLowerCase() !== 'goto')
		return false;
	const argList = token.children[1];
	if (argList === undefined || argList.children.length < 1)
		return false;
	const arg = argList.children[0];
	const previousLabel = getPreviousLabel(token);
	if (previousLabel === null ||
	previousLabel.val.toLowerCase() !== arg.val.toLowerCase())
		return false;
	return true;
}

export function removeTrivialGotoInfiniteLoops(root) {
	const gotos = getDescendentsOfType(root, ParseTreeTokenType.FUNCTION_CALL).
		filter(isOfInterest);
	gotos.forEach(function(token) {
		token.remove();
	});
	return gotos.length !== 0;
};