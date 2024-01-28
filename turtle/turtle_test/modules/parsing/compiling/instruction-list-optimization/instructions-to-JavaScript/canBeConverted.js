import { BinaryOperatorInstruction } from '../../../execution/instructions/BinaryOperatorInstruction.js';
import { CallCommandInstruction } from '../../../execution/instructions/CallCommandInstruction.js';
import { PushFromStackInstruction } from '../../../execution/instructions/PushFromStackInstruction.js';
import { PushInstruction } from '../../../execution/instructions/PushInstruction.js';
import { UnaryOperatorInstruction } from '../../../execution/instructions/UnaryOperatorInstruction.js';
import { VariableReadInstruction } from '../../../execution/instructions/VariableReadInstruction.js';

// should include all the supported classes from instructionToJavaScript.
const classes = [
	BinaryOperatorInstruction,
	CallCommandInstruction,
	PushFromStackInstruction,
	PushInstruction,
	UnaryOperatorInstruction,
	VariableReadInstruction
];

export function canBeConverted(instruction) {
	for (let i = 0; i < classes.length; i++) {
		if (instruction instanceof classes[i])
			return true;
	}
	return false;
};