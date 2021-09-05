import { getDescendentsOfTypes } from
'../../../../generic-parsing-utilities/getDescendentsOfTypes.js';
import { getSortedLastDescendentTokenOf } from
'../../../../generic-parsing-utilities/getSortedLastDescendentTokenOf.js';
import { ParseTreeToken } from
'../../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

function isIfNeedingThen(token) {
	if (token.type !== ParseTreeTokenType.IF)
		return false;
	const children = token.children;
	if (children.length < 1)
		return false;
	if (children.length === 1)
		return true;

	return children[1].type !== ParseTreeTokenType.THEN;
}

function isElseIfNeedingThen(token) {
	if (token.type !== ParseTreeTokenType.ELSEIF)
		return false;
	const children = token.children;
	if (children.length < 2)
		return false;

	return children[1].type !== ParseTreeTokenType.THEN;
}

function isNeedingThen(token) {
	return isIfNeedingThen(token) || isElseIfNeedingThen(token);
}

/*
if-then and elseif statements should include 'THEN' in QBASIC code.
This adds them to parse trees that are missing them.
Making the parse tree more correct and consistent should help the translations be more reliable.
*/
export function addThen(root) {
	const tokens = getDescendentsOfTypes(root,
		[ParseTreeTokenType.ELSEIF, ParseTreeTokenType.IF]).
		filter(isNeedingThen);
	tokens.forEach(function(token) {
		const condition = token.children[0];
		const conditionLast = getSortedLastDescendentTokenOf(condition);
		const thenToken = new ParseTreeToken('THEN', conditionLast.lineIndex, conditionLast.colIndex + 1,
			ParseTreeTokenType.THEN);
		condition.appendSibling(thenToken);
		if (token.type === ParseTreeTokenType.ELSEIF) {
			const codeBlock = new ParseTreeToken(null, thenToken.lineIndex, thenToken.colIndex + 1,
				ParseTreeTokenType.CODE_BLOCK);
			thenToken.appendChild(codeBlock);
		}
	});
	return tokens.length !== 0;
};