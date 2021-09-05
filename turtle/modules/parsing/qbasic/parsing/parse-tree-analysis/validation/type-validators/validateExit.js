import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const goodChildTypes = new Set([
	ParseTreeTokenType.DO,
	ParseTreeTokenType.FUNCTION,
	ParseTreeTokenType.FOR,
	ParseTreeTokenType.SUB,
	ParseTreeTokenType.WHILE,
]);

export function validateExit(token, parseLogger) {
	if (token.children.length !== 1) {
		parseLogger.error(`Expected an EXIT to have 1 child but found ${token.children.length}`, token);
	}
	token.children.forEach(function(child) {
		if (!goodChildTypes.has(child.type))
			parseLogger.error(`Expected an EXIT to not have a child of type ${ParseTreeTokenType.getNameFor(child.type)}`, token);
	});
};