import { getArgumentCount } from './getArgumentCount.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const lensMap = new Map([
	[ParseTreeTokenType.BINARY_OPERATOR, 2],
	[ParseTreeTokenType.BOOLEAN_LITERAL, 0],
	[ParseTreeTokenType.FOR, 2],
	[ParseTreeTokenType.LEARN, 3],
	[ParseTreeTokenType.NUMBER_LITERAL, 0],
	[ParseTreeTokenType.REPEAT, 2],
	[ParseTreeTokenType.STRING_LITERAL, 0],
	[ParseTreeTokenType.TO, 2],
	[ParseTreeTokenType.WHILE, 2],
	[ParseTreeTokenType.VARIABLE_REFERENCE, 0],
]);

export function getExpectedChildrenLengthForToken(token, procedures) {
	if (!(procedures instanceof Map))
		throw new Error(`Expected procedures to be a Map but got ${procedures}`);
	const len = lensMap.get(token.type);
	if (len !== undefined)
		return len;
	if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		let info = KTurtleCommand.getCommandInfo(token.val);
		let argsCount = getArgumentCount(token, procedures);
		if (argsCount !== undefined) {
			return Math.max(0, argsCount * 2 - 1);
		}
	}
	return 0;
};