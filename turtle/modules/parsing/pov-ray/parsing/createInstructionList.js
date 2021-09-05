import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function createInstructionList(parent, posToken) {
	if (posToken === undefined)
		posToken = parent;
	const iL = new ParseTreeToken(null, posToken.lineIndex, posToken.colIndex, ParseTreeTokenType.INSTRUCTION_LIST);
	parent.appendChild(iL);
	return iL;
};