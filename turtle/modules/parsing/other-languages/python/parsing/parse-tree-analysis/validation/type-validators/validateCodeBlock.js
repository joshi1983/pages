import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const goodChildTypes = new Set([
	ParseTreeTokenType.ASSIGNMENT_OPERATOR,
	ParseTreeTokenType.BREAK,
	ParseTreeTokenType.DOCSTRING, // a DOCSTRING can be inside a function
	ParseTreeTokenType.EXPRESSION_DOT,
	ParseTreeTokenType.FOR_LOOP,
	ParseTreeTokenType.FUNCTION_CALL,
	ParseTreeTokenType.FUNCTION_DEFINITION,
	ParseTreeTokenType.GLOBAL,
	ParseTreeTokenType.IDENTIFIER, // for example, x.y()
	ParseTreeTokenType.IF_STATEMENT,
	ParseTreeTokenType.PASS,
	ParseTreeTokenType.RETURN,
	ParseTreeTokenType.SUBSCRIPT_EXPRESSION,
	ParseTreeTokenType.WHILE_LOOP,
	ParseTreeTokenType.YIELD 
]);

export function validateCodeBlock(token, parseLogger) {
	for (const child of token.children) {
		if (!goodChildTypes.has(child.type)) {
			parseLogger.error(`A CODE_BLOCK should not have a child of type ${ParseTreeTokenType.getNameFor(child.type)}`, token);
			break;
		}
	}
};