import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';

const badParentTypes = new Set([
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.STRING_LITERAL,
	ParseTreeTokenType.TREE_ROOT,
]);

export function validateComma(token, parseLogger) {
	const children = token.children;
	if (token.val !== ',')
		parseLogger.error(`Expected val to be , but found ${token.val}`, token);
	if (token.children.length !== 0)
		parseLogger.error(`Expected comma to have no children but found ${token.children.length}`, token);
	if (token.parentNode === null || badParentTypes.has(token.parentNode.type))
		parseLogger.error(`Expected parent of , to not be a ${ParseTreeTokenType.getNameFor(token.parentNode.type)}`, token);
};