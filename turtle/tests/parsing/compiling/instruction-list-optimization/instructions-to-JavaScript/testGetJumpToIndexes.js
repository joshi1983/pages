import { getJumpToIndexes } from '../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/getJumpToIndexes.js';
import { JumpIfTrueInstruction } from '../../../../../modules/parsing/execution/instructions/JumpIfTrueInstruction.js';
import { JumpInstruction } from '../../../../../modules/parsing/execution/instructions/JumpInstruction.js';
import { ParseTreeToken } from '../../../../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../../modules/parsing/ParseTreeTokenType.js';

export function testGetJumpToIndexes(logger) {
	const tok = new ParseTreeToken(null, null, 0, 0, ParseTreeTokenType.TREE_ROOT);
	const instructions = [
		new JumpInstruction(0, tok),
		new JumpInstruction(0, tok),
		new JumpIfTrueInstruction(1, tok),
		new JumpInstruction(0, tok),
		new JumpInstruction(10, tok),
		new JumpInstruction(5, tok),
	];
	const expected = [0, 1, 5, 10];
	const result = getJumpToIndexes(instructions);
	if (result.length !== expected.length)
		logger(`Expected length of ${expected.length} but got ${result.length}`);
	else {
		for (let i = 0; i < expected.length; i++) {
			if (result[i] !== expected[i])
				logger(`[${i}] expected to be ${expected[i]} but got ${result[i]}`);
		}
	}
};