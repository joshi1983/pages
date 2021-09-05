import { createFunctionCallWithFirstArgument } from
'./createFunctionCallWithFirstArgument.js';
import { ParseTreeToken } from
'../../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const prevParentTypesForFormalArgList = new Set([
	ParseTreeTokenType.FUNCTION,
	ParseTreeTokenType.PROCEDURE
]);

function shouldCreateFunctionCall(prev) {
	const prevParent = prev.parentNode;
	if (prev.type === ParseTreeTokenType.IDENTIFIER &&
	!prevParentTypesForFormalArgList.has(prevParent.type)) {
		return true;
	}
	return false;
}

function shouldCreateArgList(prev) {
	if (!prevParentTypesForFormalArgList.has(prev.type))
		return false;
	
	return true;
}

export function processCurvedLeftBracket(prev, next) {
	if (shouldCreateFunctionCall(prev)) {
		createFunctionCallWithFirstArgument(prev, next);
		return next;
	}
	if (shouldCreateArgList(prev)) {
		if (prev.type === ParseTreeTokenType.IDENTIFIER)
			prev = prev.parentNode;
		const fArgList = new ParseTreeToken(null, next.lineIndex, next.colIndex,
			ParseTreeTokenType.FORMAL_ARG_LIST);
		fArgList.appendChild(next);
		prev.appendChild(fArgList);
		return fArgList;
	}
	const expression = new ParseTreeToken(null, next.lineIndex, next.colIndex,
			ParseTreeTokenType.CURVED_BRACKET_EXPRESSION);
	expression.appendChild(next);
	prev.appendChild(expression);
	return expression;
};