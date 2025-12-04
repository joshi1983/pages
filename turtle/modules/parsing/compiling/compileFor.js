import { addInstructionsFromCommandList } from './addInstructionsFromCommandList.js';
import { BinaryOperatorInstruction } from '../execution/instructions/BinaryOperatorInstruction.js';
import { CallCommandInstruction } from '../execution/instructions/CallCommandInstruction.js';
import { Command } from '../Command.js';
import { getInstructionsFromToken } from './compileParameters.js';
import { IncrementForCounterInstruction } from '../execution/instructions/IncrementForCounterInstruction.js';
import { JumpIfTrueInstruction } from '../execution/instructions/JumpIfTrueInstruction.js';
import { PopForcountInstruction } from '../execution/instructions/PopForcountInstruction.js';
import { PushForCountInstruction } from '../execution/instructions/PushForCountInstruction.js';
import { PushFromStackInstruction } from '../execution/instructions/PushFromStackInstruction.js';
import { setBreakJumpIndexesTo } from './setBreakJumpIndexesTo.js';
await Command.asyncInit();
const signInfo = Command.getCommandInfo('sign');

export function compileFor(parseTreeTokens, procedures, result, logger) {
	const forControlToken = parseTreeTokens[0];
	const forToken = forControlToken.parentNode;
	const forControlTokens = forControlToken.children.slice(1, forControlToken.children.length - 1);
	for (var i = 0; i < forControlTokens.length; i++) {
		getInstructionsFromToken(forControlTokens[i], procedures, result, logger);
		if (i === 0) {
			const pushVarNameInstruction = result[result.length - 1];
			pushVarNameInstruction.value = pushVarNameInstruction.value.toLowerCase();
		}
	}

	// if the step value isn't specified in the code, we need to calculate it.
	if (forControlTokens.length === 3) {
		// is initial < limit?
		// add instructions to do this: (sign limit - initial).
		result.push(new PushFromStackInstruction(2, forControlToken));
		result.push(new BinaryOperatorInstruction('-', forControlToken));
		result.push(new CallCommandInstruction(signInfo, 1, forControlToken));
	}

	result.push(new PushForCountInstruction(forControlToken));
	const loopStartInstructionIndex = result.length;
	addInstructionsFromCommandList(parseTreeTokens[1], procedures, result, logger);

	// end the loop.
	result.push(new IncrementForCounterInstruction(forControlToken));
	result.push(new JumpIfTrueInstruction(loopStartInstructionIndex, forControlToken));
	console.log(`Setting breakToIndex to ${result.length - 1} for a for-loop.`);
	setBreakJumpIndexesTo(result.length, result.length - 1, result, forToken);
	result.push(new PopForcountInstruction(forControlToken));
};