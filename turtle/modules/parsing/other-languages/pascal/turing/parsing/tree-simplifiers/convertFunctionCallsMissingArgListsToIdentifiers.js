import { getDescendentsOfType } from
'../../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

function isOfInterest(token) {
	const children = token.children;
	if (children.length === 0 ||
	children.length > 2)
		return false;

	const first = children[0];
	if (first.type !== ParseTreeTokenType.IDENTIFIER)
		return false;

	const argList = children[1];
	return argList.children.length === 0;
}

export function convertFunctionCallsMissingArgListsToIdentifiers(root) {
	const fcalls = getDescendentsOfType(root, ParseTreeTokenType.FUNCTION_CALL).
		filter(isOfInterest);
	fcalls.forEach(function(token) {
		const argList = token.children[1];
		token.removeSingleToken();
		if (argList !== undefined)
			argList.remove();
	});
	return fcalls.length !== 0;
};