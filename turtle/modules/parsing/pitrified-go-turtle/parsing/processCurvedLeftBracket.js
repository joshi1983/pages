import { isPossibleData } from
'./isPossibleData.js';
import { ParseTreeToken } from
'../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

function getGoodPrevious(token) {
	if (token.parentNode === null)
		return token;

	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.FUNC)
		return parent;
	if (parent.type === ParseTreeTokenType.EXPRESSION_DOT_PROPERTY)
		return parent;

	return token;
}

function getGoodType(token) {
	if (token.type === ParseTreeTokenType.FUNC ||
	token.type === ParseTreeTokenType.FUNC_CALL)
		return ParseTreeTokenType.ARG_LIST;
	if (token.type === ParseTreeTokenType.IMPORT)
		return ParseTreeTokenType.IMPORT_PACKAGE_LIST;

	return ParseTreeTokenType.CURVED_BRACKET_EXPRESSION;
}

function shouldCreateFuncCall(token) {
	if (isPossibleData(token))
		return true;
	return false;
}

export function processCurvedLeftBracket(prev, next) {
	prev = getGoodPrevious(prev);
	if (shouldCreateFuncCall(prev)) {
		const fCall = new ParseTreeToken(null, prev.lineIndex, prev.colIndex, ParseTreeTokenType.FUNC_CALL);;
		const prevParent = prev.parentNode;
		prevParent.replaceChild(prev, fCall);
		fCall.appendChild(prev);
		prev = fCall;
	}
	let type = getGoodType(prev);
	const curvedBracketExpression = new ParseTreeToken(null, next.lineIndex, next.colIndex, type);
	curvedBracketExpression.appendChild(next);
	prev.appendChild(curvedBracketExpression);
	return curvedBracketExpression;
};