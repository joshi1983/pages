import { isComment } from './scanning/isComment.js';
import { ParseTreeTokenType } from './ParseTreeTokenType.js';
import { WebTurtleCommand } from './WebTurtleCommand.js';
import { SonicWebTurtleOperators } from './SonicWebTurtleOperators.js';

const nameTypeMap = new Map([
	['else', ParseTreeTokenType.ELSE],
	['end', ParseTreeTokenType.END],
	['endif', ParseTreeTokenType.ENDIF],
	['go', ParseTreeTokenType.GO],
	['if', ParseTreeTokenType.IF],
	['let', ParseTreeTokenType.LET],
	['next', ParseTreeTokenType.NEXT],
	['repeat', ParseTreeTokenType.REPEAT],
	['return', ParseTreeTokenType.RETURN],
]);
SonicWebTurtleOperators.getAllOperatorsData().forEach(function(info) {
	nameTypeMap.set(info.symbol, ParseTreeTokenType.BINARY_OPERATOR);
});

export function getParseTreeTokenTypeForString(s) {
	if (isComment(s))
		return ParseTreeTokenType.COMMENT;
	if (s[0] === '#')
		return ParseTreeTokenType.PROC_START;
	if (s[0] === '^')
		return ParseTreeTokenType.INPUT_REFERENCE;
	if (!isNaN(s))
		return ParseTreeTokenType.NUMBER_LITERAL;
	if (s[0] === '"')
		return ParseTreeTokenType.STRING_LITERAL;
	const type = nameTypeMap.get(s.toLowerCase());
	if (type !== undefined)
		return type;
	if (WebTurtleCommand.getCommandInfo(s) !== undefined)
		return ParseTreeTokenType.COMMAND;
	return ParseTreeTokenType.VARIABLE_REFERENCE;
};