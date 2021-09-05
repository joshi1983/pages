/*
Verifies that instruction is a kind of jump instruction.
For example, JumpInstruction, JumpIfTrueInstruction.
*/
export function isJumpInstruction(instruction) {
	const constructorName = instruction.constructor.name;
	return constructorName.startsWith('Jump');
};