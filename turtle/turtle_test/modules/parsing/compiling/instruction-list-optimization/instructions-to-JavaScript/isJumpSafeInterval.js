/*
Verifies that instruction is a kind of jump instruction.
For example, JumpInstruction, JumpIfTrueInstruction.
*/
export function isJumpInstruction(instruction) {
	const constructorName = instruction.constructor.name;
	return constructorName.startsWith('Jump');
};

/*
Checks if the specified interval of instructions can be safely converted to 
1 without introducing problems with jumps to indexes within the range.

Jumps from the interval to the interval are ignored because it is assumed that the
conversion to 1 instruction will eliminate them.
*/
export function isJumpSafeInterval(instructions, startIndex, endIndex) {
	for (let i = 0; i < instructions.length; i++) {
		if (i === startIndex) {
			i = endIndex + 1;
			if (i >= instructions.length)
				break;
		}
		const instruction = instructions[i];
		if (instruction.jumpToIndex !== undefined) {
			if (instruction.jumpToIndex > startIndex && instruction.jumpToIndex <= endIndex &&
			isJumpInstruction(instruction)) {
				return false;
			}
		}
	}
	return true;
};