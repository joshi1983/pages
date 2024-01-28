import { PushInstruction } from '../../execution/instructions/PushInstruction.js';

export function isConstantPush(instruction) {
	return instruction instanceof PushInstruction;
};