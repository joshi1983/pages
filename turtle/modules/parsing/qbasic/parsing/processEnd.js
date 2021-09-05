import { ParseTreeToken } from
'../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';
import { SetUtils } from
'../../../SetUtils.js';

const prevTypeToParentTokenType = new Map([
	[ParseTreeTokenType.DEF, ParseTreeTokenType.END_DEF],
	[ParseTreeTokenType.FUNCTION, ParseTreeTokenType.END_FUNCTION],
	[ParseTreeTokenType.IF, ParseTreeTokenType.END_IF],
	[ParseTreeTokenType.SELECT, ParseTreeTokenType.END_SELECT],
	[ParseTreeTokenType.SUB, ParseTreeTokenType.END_SUB],
	[ParseTreeTokenType.TYPE, ParseTreeTokenType.END_TYPE],
]);

const goodPrevTypes = new Set([
	ParseTreeTokenType.TREE_ROOT
]);
SetUtils.addAll(goodPrevTypes, prevTypeToParentTokenType.keys());

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;
	if (goodPrevTypes.has(token.type))
		return true;
	return false;
}

function getGoodPrevious(token) {
	while (!isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

export function processEnd(prev, next, functionsMap) {
	prev = getGoodPrevious(prev);
	const newParentType = prevTypeToParentTokenType.get(prev.type);
	if (newParentType !== undefined) {
		const endParent = new ParseTreeToken(null, next.lineIndex, next.colIndex,
			newParentType);
		endParent.appendChild(next);
		prev.appendChild(endParent);
		return endParent;
	}
	prev.appendChild(next);
	return prev;
};