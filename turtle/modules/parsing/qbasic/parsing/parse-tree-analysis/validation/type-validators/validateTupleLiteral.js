import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const badChildTypes = new Set([
	ParseTreeTokenType.CASE,
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.DO,
	ParseTreeTokenType.END,
	ParseTreeTokenType.END_FUNCTION,
	ParseTreeTokenType.END_IF,
	ParseTreeTokenType.END_TYPE,
	ParseTreeTokenType.FOR,
	ParseTreeTokenType.FUNCTION,
	ParseTreeTokenType.LOOP,
	ParseTreeTokenType.NEXT,
	ParseTreeTokenType.SELECT,
	ParseTreeTokenType.SQUARE_LEFT_BRACKET,
	ParseTreeTokenType.SQUARE_RIGHT_BRACKET,
	ParseTreeTokenType.SUB,
	ParseTreeTokenType.UNTIL,
	ParseTreeTokenType.WEND,
	ParseTreeTokenType.WHILE,
]);

export function validateTupleLiteral(token, parseLogger) {
	const children = token.children;
	if (children.length < 2) {
		parseLogger.error(`Expected a TUPLE_LITERAL to have at least 2 children but found ${children.length}`, token);
	}
	else {
		const first = children[0];
		const last = children[children.length - 1];
		if (first.type !== ParseTreeTokenType.CURVED_LEFT_BRACKET)
			parseLogger.error(`Expected a TUPLE_LITERAL to have a first child of ( but found ${first.val}`, token);
		if (last.type !== ParseTreeTokenType.CURVED_RIGHT_BRACKET)
			parseLogger.error(`Expected a TUPLE_LITERAL to have a last child of ) but found ${last.val}`, token);
	}
	children.forEach(function(child) {
		if (badChildTypes.has(child.type))
			parseLogger.error(`Expected a TUPLE_LITERAL to not have a child of type ${ParseTreeTokenType.getNameFor(child.type)}`, token);
	});
};