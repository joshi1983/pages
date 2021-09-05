import { filterOperandValueTokens } from './instructions/filterOperandValueTokens.js';
import { Instruction } from '../../Instruction.js';
import { processSpecialInstruction } from './instructions/processSpecialInstruction.js';
import { processTokens } from './processTokens.js';

export function processInstruction(token, result, settings) {
	const info = Instruction.getInstructionInfo(token.val);
	result.processCommentsUpToToken(token);
	result.trimRight();
	result.append('\n')
	if (processSpecialInstruction(token, result, settings)) {
		result.trimRight();
		return;
	}
	if (info !== undefined && info.to !== undefined) {
		result.append(info.to);
	}
	else {
		result.append(token.val);
	}
	if (token.children.length !== 0)
		result.append(' ');
	processTokens(filterOperandValueTokens(token.children), result, settings);
	result.trimRight();
};