import { BinaryOperatorInstruction } from '../../execution/instructions/BinaryOperatorInstruction.js';
import { CallCommandInstruction } from '../../execution/instructions/CallCommandInstruction.js';
import { PushFromStackInstruction } from '../../execution/instructions/PushFromStackInstruction.js';
import { staticEvaluateBinaryOperator } from './staticEvaluateBinaryOperators.js';
import { staticEvaluateCommand } from './staticEvaluateCommands.js';
import { substitutePushFromStackConstants } from './substitutePushFromStackConstants.js';

export function optimizeOptionalForStepCalculation(instructions) {
	for (let i = 1; i < instructions.length - 1; i++) {
		if (instructions[i] instanceof PushFromStackInstruction &&
		instructions[i].numToPush === 2 &&
		instructions[i + 1] instanceof BinaryOperatorInstruction) {
			if (substitutePushFromStackConstants(instructions, i)) {
				/*
				Since the substitutePushFromStackConstants call adds 1 more instruction and optimizing should overall 
				reduce the number of instructions, we want to proces a couple more things to ensure the length is reduced.
				
				Any optimization that increases instructions.length could lead to simplifyInstructions cutting out of a loop 
				before all possible improvements are made.
				*/
				staticEvaluateBinaryOperator(instructions, i + 2);
				// process sign command.
				if (instructions[i + 1] instanceof CallCommandInstruction) {
					staticEvaluateCommand(instructions, i + 1);
				}
			}
		}
	}
};