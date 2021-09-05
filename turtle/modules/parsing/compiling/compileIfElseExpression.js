import { JumpIfTrueInstruction } from '../execution/instructions/JumpIfTrueInstruction.js';
import { JumpInstruction } from '../execution/instructions/JumpInstruction.js';
import { getInstructionsFromToken } from './compileParameters.js';

export function compileIfElseExpression(parseTreeTokens, procedures, result, logger) {
	if (parseTreeTokens.length <= 2)
		throw new Error('Ifelse requires 3 parameters but only ' + parseTreeTokens.length + ' available.');

	// Add instructions to calculate and push the boolean condition value.
	getInstructionsFromToken(parseTreeTokens[0], procedures, result, logger);
	const jumpInstruction1 = new JumpIfTrueInstruction(0, parseTreeTokens[0]);
	result.push(jumpInstruction1);

	// add instructions for else- expression.
	getInstructionsFromToken(parseTreeTokens[2], procedures, result, logger);
	const jumpInstruction2 = new JumpInstruction(0, parseTreeTokens[0]);
	result.push(jumpInstruction2);

	jumpInstruction1.setNewIndex(result.length);

	// add instructions for if condition is true.
	getInstructionsFromToken(parseTreeTokens[1], procedures, result, logger);

	jumpInstruction2.setNewIndex(result.length);
};