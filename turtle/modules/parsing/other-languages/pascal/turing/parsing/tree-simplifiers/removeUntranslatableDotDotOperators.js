import { getDescendentsOfType } from
'../../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

function isOfInterest(token) {
	if (token.val !== '..' ||
	token.children.length >= 2)
		return false;

	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.BINARY_OPERATOR &&
	parent.val.toLowerCase() === 'by')
		return false;

	return true;
}

export function removeUntranslatableDotDotOperators(root) {
	const toRemove = getDescendentsOfType(root, ParseTreeTokenType.BINARY_OPERATOR).
		filter(isOfInterest);
	toRemove.forEach(function(token) {
		token.removeSingleToken();
	});
	
	return toRemove.length !== 0;
};