import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const firstChildTypes = new Set([
	ParseTreeTokenType.EXPRESSION_DOT,
	ParseTreeTokenType.IDENTIFIER
]);

export function validateFunctionCalls(token, parseLogger) {
	const children = token.children;
	if (children.length !== 2) {
		parseLogger.error(`Expected a FUNCTION_CALL to have 2 children but found ${children.length}`, token);
	}
	else if (children.length === 1) {
		const first = children[0];
		const last = children[1];
		if (firstChildTypes.has(first.type))
			parseLogger.error(`Expected first child of FUNCTION_CALL to not be a type but found ${ParseTreeTokenType.getNameFor(first.type)}`, first);
		if (last.type !== ParseTreeTokenType.ARG_LIST)
			parseLogger.error(`Expected last child of FUNCTION_CALL to have a type ARG_LIST but found ${ParseTreeTokenType.getNameFor(last.type)}`, last);
	}
};