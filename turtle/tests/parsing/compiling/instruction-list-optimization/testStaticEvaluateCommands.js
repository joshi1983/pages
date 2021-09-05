import { CallCommandInstruction } from '../../../../modules/parsing/execution/instructions/CallCommandInstruction.js';
import { Command } from '../../../../modules/parsing/Command.js';
import { createRootToken } from '../../../helpers/createRootToken.js';
import { PushInstruction } from '../../../../modules/parsing/execution/instructions/PushInstruction.js';
import { staticEvaluateCommands } from '../../../../modules/parsing/compiling/instruction-list-optimization/staticEvaluateCommands.js';
await Command.asyncInit();

const treeRoot = createRootToken();
const absInfo = Command.getCommandInfo('abs');

export function testStaticEvaluateCommands(logger) {
	const instructions = [
		new PushInstruction(-5, treeRoot, false),
		new CallCommandInstruction(absInfo, 1, treeRoot),
		new PushInstruction(123, treeRoot, false)
	];
	staticEvaluateCommands(instructions);
	if (instructions.length === 2) {
		if (instructions[0] instanceof PushInstruction) {
			if (instructions[0].value !== 5)
				logger('Expected to push 5 but instead pushed ' + instructions[0].value);
		}
		else
			logger('Expected first instruction to be a push but got something else');
	}
	else
		logger('Expected length to be 2 but got ' + instructions.length);
};