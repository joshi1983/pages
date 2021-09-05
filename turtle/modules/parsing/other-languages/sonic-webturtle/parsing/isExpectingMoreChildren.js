import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { WebTurtleCommand } from '../WebTurtleCommand.js';

const typeCountMap = new Map([
	[ParseTreeTokenType.BINARY_OPERATOR, 2],
	[ParseTreeTokenType.GO, 1],
	[ParseTreeTokenType.INPUT_REFERENCE, 0],
	[ParseTreeTokenType.LET, 2],
	[ParseTreeTokenType.NUMBER_LITERAL, 0],
	[ParseTreeTokenType.REPEAT, 3],
	[ParseTreeTokenType.STRING_LITERAL, 0],
	[ParseTreeTokenType.VARIABLE_REFERENCE, 0]
]);

export function isExpectingMoreChildren(token) {
	if (token.type === ParseTreeTokenType.IF) {
		if (token.children.length < 3)
			return true;
	}
	if (token.type === ParseTreeTokenType.COMMAND) {
		const info = WebTurtleCommand.getCommandInfo(token.val);
		if (info !== undefined) {
			return WebTurtleCommand.getArgCount(info) > token.children.length;
		}
	}
	const num = typeCountMap.get(token.type);
	if (num !== undefined)
		return token.children.length < num;
	return false;
};