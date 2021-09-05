import { filterAllBracketsAndCommas } from
'../type-processors/helpers/filterAllBracketsAndCommas.js';
import { getDescendentsOfType } from
'../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

function lenTokenToListToken(token) {
	const argList = token.children[0];
	if (argList === undefined)
		return;
	const children = filterAllBracketsAndCommas(argList.children);
	if (children.length !== 1)
		return;
	const child = children[0];
	if (child.type !== ParseTreeTokenType.LIST_LITERAL &&
	child.type !== ParseTreeTokenType.TUPLE_LITERAL)
		return;
	return child;
}

function isOfInterest(token) {
	const name = token.val;
	if (name !== 'len')
		return false;
	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.DOT)
		return false;
	const child = lenTokenToListToken(token);
	if (child === undefined)
		return false;
	return true;
}

export function simplifyLen(root) {
	const lenCalls = getDescendentsOfType(root, ParseTreeTokenType.FUNCTION_CALL).filter(isOfInterest);
	lenCalls.forEach(function(token, index) {
		const listToken = lenTokenToListToken(token);
		const len = filterAllBracketsAndCommas(listToken.children).length;
		token.val = '' + len;
		token.type = ParseTreeTokenType.NUMBER_LITERAL;
		token.removeAllChildren();
	});
	return lenCalls.length !== 0;
};