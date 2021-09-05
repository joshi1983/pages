import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { processInstructionListIfNeeded } from './processInstructionListIfNeeded.js';
import { WebTurtleCommand } from '../WebTurtleCommand.js';

const goodPrevTypes = new Set([
	ParseTreeTokenType.COMMAND,
	ParseTreeTokenType.ELSE,
	ParseTreeTokenType.IF,
	ParseTreeTokenType.INSTRUCTION_LIST,
	ParseTreeTokenType.LET,
	ParseTreeTokenType.REPEAT,
	ParseTreeTokenType.PROC_START,
]);

function isGoodPreviousToken(token) {
	if (token.parentNode === null)
		return true;
	if (!goodPrevTypes.has(token.type))
		return false;
	if (token.type === ParseTreeTokenType.IF &&
	token.children.length > 2 &&
	token.children[token.children.length - 1].type === ParseTreeTokenType.ENDIF)
		return false;
	if (token.type === ParseTreeTokenType.REPEAT &&
	token.children.length > 2 &&
	token.children[token.children.length - 1].type === ParseTreeTokenType.NEXT)
		return false;
	if (token.type === ParseTreeTokenType.COMMAND ||
	token.type === ParseTreeTokenType.LET) {
		const argCount = WebTurtleCommand.getArgCount(WebTurtleCommand.getCommandInfo(token.val));
		if (argCount < token.children.length)
			return true;
		return false;
	}
	return true;
}

function getGoodPrevious(token) {
	while (!isGoodPreviousToken(token))
		token = token.parentNode;
	return token;
}

export function processCommand(previousToken, nextToken) {
	previousToken = getGoodPrevious(previousToken);
	previousToken = processInstructionListIfNeeded(previousToken, nextToken);
	previousToken.appendChild(nextToken);
	return nextToken;
};