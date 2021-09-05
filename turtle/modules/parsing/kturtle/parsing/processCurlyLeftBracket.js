import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const parentsNeedingCodeBlockSibling = new Set([
	ParseTreeTokenType.FOR,
	ParseTreeTokenType.IF,
	ParseTreeTokenType.REPEAT,
	ParseTreeTokenType.WHILE,
]);

function shouldAppendSibling(previousToken) {
	const prevParent = previousToken.parentNode;
	if (prevParent !== null && parentsNeedingCodeBlockSibling.has(prevParent.type))
		return true;
	return false;
}

export function processCurlyLeftBracket(previousToken, nextToken) {
	const codeBlock = new ParseTreeToken(null, nextToken.lineIndex, nextToken.colIndex, ParseTreeTokenType.CODE_BLOCK);
	codeBlock.appendChild(nextToken);
	if (shouldAppendSibling(previousToken)) {
		previousToken.appendSibling(codeBlock);
	}
	else if (previousToken.type === ParseTreeTokenType.IDENTIFIER &&
	previousToken.parentNode.type === ParseTreeTokenType.LEARN) {
		const parametersList = new ParseTreeToken(null, nextToken.lineIndex, nextToken.colIndex, ParseTreeTokenType.PARAMETERS_PARENT);
		const learnToken = previousToken.parentNode;
		learnToken.appendChild(parametersList);
		learnToken.appendChild(codeBlock);
	}
	else if (previousToken.type === ParseTreeTokenType.PARAMETERS_PARENT) {
		previousToken.appendSibling(codeBlock);
	}
	else {
		previousToken.appendChild(codeBlock);
	}
	return codeBlock;
};