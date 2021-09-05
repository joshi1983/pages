import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const goodChildTypes = new Set([
	ParseTreeTokenType.ASSIGNMENT,
	ParseTreeTokenType.CALL,
	ParseTreeTokenType.COMMON,
	ParseTreeTokenType.CONST,
	ParseTreeTokenType.DECLARE,
	ParseTreeTokenType.DEF,
	ParseTreeTokenType.DEF_PRIMITIVE,
	ParseTreeTokenType.DIM,
	ParseTreeTokenType.DO,
	ParseTreeTokenType.DO_UNTIL,
	ParseTreeTokenType.DO_WHILE,
	ParseTreeTokenType.END,
	ParseTreeTokenType.EXIT,
	ParseTreeTokenType.FOR,
	ParseTreeTokenType.FUNCTION,
	ParseTreeTokenType.FUNCTION_CALL,
	ParseTreeTokenType.GOSUB,
	ParseTreeTokenType.IF,
	ParseTreeTokenType.LABEL,
	ParseTreeTokenType.LET,
	ParseTreeTokenType.ON,
	ParseTreeTokenType.REDIM,
	ParseTreeTokenType.RETURN,
	ParseTreeTokenType.SELECT,
	ParseTreeTokenType.SHARED,
	ParseTreeTokenType.SUB,
	ParseTreeTokenType.TYPE,
	ParseTreeTokenType.WHILE,
]);

export function validateTreeRoot(token, parseLogger) {
	const children = token.children;
	for (const child of children) {
		if (!goodChildTypes.has(child.type))
			parseLogger.error(`Expected a TREE_ROOT to not have a child of type ${ParseTreeTokenType.getNameFor(child.type)}.  ` +
			`The child has val of ${child.val} which may help you find the problem.`, token);
	}
};