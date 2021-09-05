import { JumpInstruction } from '../../../../modules/parsing/execution/instructions/JumpInstruction.js';
import { ParseTreeToken } from '../../../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../modules/parsing/ParseTreeTokenType.js';
import { PopInstruction } from '../../../../modules/parsing/execution/instructions/PopInstruction.js';
import { removeInstructions } from '../../../../modules/parsing/compiling/instruction-list-optimization/removeInstructions.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

const rootToken = new ParseTreeToken(null, null, 0, 0, ParseTreeTokenType.TREE_ROOT);

function testWithEmptyArray(logger) {
	removeInstructions([], 0, 0);
}

function testWithOneInstruction(logger) {
	const a = [new PopInstruction(rootToken)];
	removeInstructions(a, 0, 0);
	if (a.length !== 1)
		logger('Expected length to be 1 but got ' + a.length);
	removeInstructions(a, 0, 1);
	if (a.length !== 0)
		logger('Expected length to be 0 but got ' + a.length);
}

function testJumpReindexing(logger) {
	const a = [
		new PopInstruction(rootToken),
		new PopInstruction(rootToken),
		new JumpInstruction(0, rootToken),
		new JumpInstruction(2, rootToken)
	];
	removeInstructions(a, 1, 1);
	if (a.length !== 3)
		logger('length expected to be 3 but got ' + a.length);
	else {
		const jumpInstruction1 = a[1];
		if (jumpInstruction1.jumpToIndex !== 0)
			logger('jumpToIndex expected to be 0 after removeInstructions but got ' + jumpInstruction1.jumpToIndex);
		const jumpInstruction2 = a[2];
		if (jumpInstruction2.jumpToIndex !== 1)
			logger('jumpToIndex expected to be 1 after removeInstructions but got ' + jumpInstruction2.jumpToIndex);
	}
}

export function testRemoveInstructions(logger) {
	wrapAndCall([
		testJumpReindexing,
		testWithEmptyArray,
		testWithOneInstruction
	], logger);
};