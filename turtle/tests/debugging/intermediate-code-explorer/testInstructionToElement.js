import { CallCommandInstruction } from '../../../modules/parsing/execution/instructions/CallCommandInstruction.js';
import { Command } from '../../../modules/parsing/Command.js';
import { instructionToElement } from '../../../modules/debugging/intermediate-code-explorer/instructionToElement.js';
import { ParseTreeToken } from '../../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../modules/parsing/ParseTreeTokenType.js';
await Command.asyncInit();
await ParseTreeToken.asyncInit();

export function testInstructionToElement(logger) {
	const token = new ParseTreeToken('forward', null, 0, 0, ParseTreeTokenType.PARAMETERIZED_GROUP);
	const instruction = new CallCommandInstruction(Command.getCommandInfo('forward'), 1, token);
	const e = instructionToElement(0, instruction);
	if (!(e instanceof Element))
		logger('instructionToElement should return an Element but got ' + e);
	else {
		const textContent = e.textContent.toLowerCase();
		const expectedSubstrings = ['forward', '1', 'numargs'];
		expectedSubstrings.forEach(function(substring) {
			if (textContent.indexOf(substring) === -1)
				logger('Expected to find ' + substring + ' but did not in textContent "' + textContent + '"');
		});
	}
};