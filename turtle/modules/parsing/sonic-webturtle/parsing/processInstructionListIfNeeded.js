import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const typesWithInstructionListChildren = new Set([
	ParseTreeTokenType.ELSE,
	ParseTreeTokenType.IF,
	ParseTreeTokenType.PROC_START,
	ParseTreeTokenType.REPEAT,
]);
const lastChildTypesIndicatingNoInstructionListNeeded = new Set([
	ParseTreeTokenType.ENDIF,
	ParseTreeTokenType.INSTRUCTION_LIST,
	ParseTreeTokenType.NEXT,
	ParseTreeTokenType.RETURN
]);

function needsInstructionList(previousToken, nextToken) {
	if (!typesWithInstructionListChildren.has(previousToken.type))
		return false;
	if (previousToken.children.length !== 0) {
		const lastChild = previousToken.children[previousToken.children.length - 1];
		if (lastChildTypesIndicatingNoInstructionListNeeded.has(lastChild.type))
			return false;
	}
	if ((previousToken.type === ParseTreeTokenType.REPEAT ||
	previousToken.type === ParseTreeTokenType.IF) &&
	previousToken.children.length === 0)
		return false;
	return true;
}

export function processInstructionListIfNeeded(previousToken, nextToken) {
	if (previousToken.type === ParseTreeTokenType.IF &&
	previousToken.children.length > 2)
		previousToken = previousToken.children[previousToken.children.length - 1];
	if (needsInstructionList(previousToken, nextToken)) {
		const instructionList = new ParseTreeToken(null, nextToken.lineIndex, nextToken.colIndex, ParseTreeTokenType.INSTRUCTION_LIST);
		previousToken.appendChild(instructionList);
		return instructionList;
	}
	return previousToken;
};