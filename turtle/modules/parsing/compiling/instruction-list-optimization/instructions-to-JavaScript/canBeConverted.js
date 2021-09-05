import { BinaryOperatorInstruction } from '../../../execution/instructions/BinaryOperatorInstruction.js';
import { CallCommandInstruction } from '../../../execution/instructions/CallCommandInstruction.js';
import { PushFromStackInstruction } from '../../../execution/instructions/PushFromStackInstruction.js';
import { PushInstruction } from '../../../execution/instructions/PushInstruction.js';
import { shouldValueBeTranslatedToJavaScriptCode } from
'./shouldValueBeTranslatedToJavaScriptCode.js';
import { UnaryOperatorInstruction } from '../../../execution/instructions/UnaryOperatorInstruction.js';
import { VariableReadInstruction } from '../../../execution/instructions/VariableReadInstruction.js';

// should include all the supported classes from instructionToJavaScript.
const classes = [
	BinaryOperatorInstruction,
	CallCommandInstruction,
	PushFromStackInstruction,
	UnaryOperatorInstruction,
	VariableReadInstruction
];

export function canBeConverted(instruction) {
	for (let i = 0; i < classes.length; i++) {
		if (instruction instanceof classes[i])
			return true;
	}
	if (instruction instanceof PushInstruction) {
		// If the pushed value contains cycles, it really can't be converted to JavaScript with a value literal.
		// If the pushed value is too large, it SHOULD not be translated to a value literal.
		// A large value could be translated but it such a translation risks performance problems
		// if the JavaScript value literal is millions of characters long.
		return shouldValueBeTranslatedToJavaScriptCode(instruction.value);
	}
	return false;
};