import { BinaryOperatorInstruction } from '../../execution/instructions/BinaryOperatorInstruction.js';
import { CallCommandInstruction } from '../../execution/instructions/CallCommandInstruction.js';
import { Operators } from '../../Operators.js';
import { removeInstructions } from './removeInstructions.js';
await Operators.asyncInit();

/*
This optimization corresponds with observing that expressions like:
not :x < 5
can be simplified to:
:x >= 5

Similar changes can be made to a lot of "not" comparisons.
*/
export function removeNotImmediatelyAfterComparison(instructions) {
	for (let i = 1; i < instructions.length; i++) {
		if (instructions[i] instanceof CallCommandInstruction &&
			instructions[i].command.primaryName === 'not' &&
			instructions[i - 1] instanceof BinaryOperatorInstruction &&
			Operators.getOperatorInfo(instructions[i - 1].operatorSymbol).notSymbol !== undefined) {
			const symbol = Operators.getOperatorInfo(instructions[i - 1].operatorSymbol).notSymbol;
			const parseTreeToken = instructions[i - 1].parseTreeToken;
			instructions[i - 1] = new BinaryOperatorInstruction(symbol, parseTreeToken);
			removeInstructions(instructions, i, 1);
		}
	}
};