import { filterBracketsAndCommas } from
'./helpers/filterBracketsAndCommas.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processTokens } from
'./helpers/processTokens.js';
import { TuringFunction } from
'../../TuringFunction.js';

function unwrapCurvedBracketExpression(token) {
	while (token.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION) {
		token = token.children[1];
		if (token === undefined)
			return;
	}
	return token;
}

function getClassName(token) {
	token = unwrapCurvedBracketExpression(token);
	if (token === undefined)
		return;
	if (token.type !== ParseTreeTokenType.EXPRESSION_DOT_PROPERTY)
		return;
	const classNameToken = token.children[0];
	if (classNameToken.type === ParseTreeTokenType.IDENTIFIER)
		return classNameToken.val;
}

function getFunctionName(token) {
	token = unwrapCurvedBracketExpression(token);
	if (token === undefined)
		return;

	while (token.type === ParseTreeTokenType.EXPRESSION_DOT_PROPERTY) {
		token = token.children[2];
		if (token === undefined)
			return;
	}

	if (token.type === ParseTreeTokenType.IDENTIFIER)
		return token.val;
}

export function processFunctionCall(token, result) {
	const firstChild = token.children[0];
	const name = getFunctionName(firstChild);
	const className = getClassName(firstChild);
	const argList = token.children[1];
	if (name === undefined) {
		result.append(`\n; Failed to translate a function or procedure call.`);
		result.append(`\n; Unable to find the name of the function.\n`);
		return;
	}
	const info = TuringFunction.getFunctionInfo(name, className);
	if (info !== undefined) {
		if (info.returnTypes === null) {
			result.processCommentsUpToToken(token);
			result.append('\n');
		}
	}
	if (info !== undefined &&
	(info.to !== undefined)) {
		result.append(info.to);
	}
	else if (info === undefined) {
		result.append(name);
	}
	result.append(' ');
	if (argList !== undefined)
		processTokens(filterBracketsAndCommas(argList.children), result);
};