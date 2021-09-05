import { getDescendentsOfType } from '../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeToken } from '../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

function isOfInterest(token) {
	const children = token.children;
	if (children.length !== 1)
		return false;

	const child = children[0];
	if (child.type !== ParseTreeTokenType.IDENTIFIER ||
	child.children.length !== 1)
		return false;

	const curlyBracketExpression = child.children[0];
	return curlyBracketExpression.type === ParseTreeTokenType.CURLY_BRACKET_EXPRESSION;
}

export function addFunctionArgList(root) {
	const functions = getDescendentsOfType(root, ParseTreeTokenType.FUNCTION).filter(isOfInterest);
	functions.forEach(function(functionToken) {
		const identifier = functionToken.children[0];
		const curlyBracketExpression = identifier.children[0];
		identifier.removeChild(curlyBracketExpression);
		curlyBracketExpression.type = ParseTreeTokenType.CODE_BLOCK;
		const argList = new ParseTreeToken(null, identifier.lineIndex, identifier.colIndex + 1, ParseTreeTokenType.ARG_LIST);
		argList.appendChild(new ParseTreeToken('(', argList.lineIndex, argList.colIndex, ParseTreeTokenType.CURVED_LEFT_BRACKET));
		argList.appendChild(new ParseTreeToken(')', argList.lineIndex, argList.colIndex, ParseTreeTokenType.CURVED_RIGHT_BRACKET));
		functionToken.appendChild(argList);
		functionToken.appendChild(curlyBracketExpression);
	});
};