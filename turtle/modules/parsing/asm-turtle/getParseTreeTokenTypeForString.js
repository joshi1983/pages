import { Instruction } from './Instruction.js';
import { isComment } from './scanning/isComment.js';
import { ParseTreeTokenType } from './ParseTreeTokenType.js';

export function getParseTreeTokenTypeForString(s) {
	if (isComment(s))
		return ParseTreeTokenType.COMMENT;
	if (s.startsWith('@'))
		return ParseTreeTokenType.LABEL;
	if (!isNaN(s))
		return ParseTreeTokenType.NUMBER_LITERAL;
	if (s === ':')
		return ParseTreeTokenType.COLON;
	if (s === ',')
		return ParseTreeTokenType.COMMA;
	if (s.toLowerCase() === 'var')
		return ParseTreeTokenType.VAR_DECLARATIONS;
	if (s.toLowerCase() === 'instr')
		return ParseTreeTokenType.INSTRUCTION_LIST;
	if (s.toLowerCase() === 'proc')
		return ParseTreeTokenType.PROC_START;
	if (Instruction.getInstructionInfo(s) !== undefined)
		return ParseTreeTokenType.INSTRUCTION;
	return ParseTreeTokenType.VARIABLE_REFERENCE;
};