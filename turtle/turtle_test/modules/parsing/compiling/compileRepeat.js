import { BinaryOperatorInstruction } from '../execution/instructions/BinaryOperatorInstruction.js';
import { getInstructionsFrom } from './getInstructionsFrom.js';
import { getInstructionsFromToken } from './compileParameters.js';
import { JumpIfTrueInstruction } from '../execution/instructions/JumpIfTrueInstruction.js';
import { JumpInstruction } from '../execution/instructions/JumpInstruction.js';
import { IncrementRepcountInstruction } from '../execution/instructions/IncrementRepcountInstruction.js';
import { PopInstruction } from '../execution/instructions/PopInstruction.js';
import { PopRepcountInstruction } from '../execution/instructions/PopRepcountInstruction.js';
import { PushFromStackInstruction } from '../execution/instructions/PushFromStackInstruction.js';
import { PushInstruction } from '../execution/instructions/PushInstruction.js';
import { PushMaxRepcountInstruction } from '../execution/instructions/PushMaxRepcountInstruction.js';
import { setBreakJumpIndexesTo } from './setBreakJumpIndexesTo.js';

export function compileRepeat(parseTreeTokens, procedures, result, logger) {
	getInstructionsFromToken(parseTreeTokens[0], procedures, result, logger);
	// skip the loop if the value is < 1.
	// Is the value < 1?
	// If yes, jump to end of loop.
	result.push(new PushFromStackInstruction(1, parseTreeTokens[0]));
	result.push(new PushInstruction(1, parseTreeTokens[0], false));
	result.push(new BinaryOperatorInstruction('>=', parseTreeTokens[0]));
	result.push(new JumpIfTrueInstruction(result.length + 3, parseTreeTokens[0]));
	result.push(new PopInstruction(parseTreeTokens[0]));
	const skipEntireLoopJump = new JumpInstruction(0, parseTreeTokens[0]);
	result.push(skipEntireLoopJump);

	result.push(new PushMaxRepcountInstruction(parseTreeTokens[0]));
	const loopStartInstructionIndex = result.length;

	const commandListToken = parseTreeTokens[1];
	const bodyTokens = commandListToken.children.slice(1, commandListToken.getChildCount() - 1);
	getInstructionsFrom(bodyTokens, procedures, logger, result);

	// end the loop.
	result.push(new IncrementRepcountInstruction(parseTreeTokens[0]));
	result.push(new JumpIfTrueInstruction(loopStartInstructionIndex, parseTreeTokens[0]));
	const breakToIndex = result.length;
	result.push(new PopRepcountInstruction(parseTreeTokens[0]));
	skipEntireLoopJump.jumpToIndex = result.length;
	setBreakJumpIndexesTo(breakToIndex, breakToIndex - 2, result);
};