import { CallCommandInstruction } from '../modules/parsing/execution/instructions/CallCommandInstruction.js';
import { Command } from '../modules/parsing/Command.js';
import { exceptionToString } from '../modules/exceptionToString.js';
import { ParseTreeToken } from '../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../modules/parsing/ParseTreeTokenType.js';
await Command.asyncInit();
await ParseTreeToken.asyncInit();

export function testExceptionToString(logger) {
	let msg = exceptionToString(new Error("Number required"));
	if (typeof msg !== 'string')
		logger('exceptionToString should return a string but not a string');

	const error = new Error("Number required");
	error.message = 'Number required';
	const instruction = new CallCommandInstruction(Command.getCommandInfo('fd'), 1, new ParseTreeToken('fd', null, 0, 0, ParseTreeTokenType.PARAMETERIZED_GROUP));
	msg = exceptionToString({
		'details': {
			'e': error,
			'instruction': instruction
		}
	});
	if (typeof msg !== 'string' || msg.indexOf('Number required') === -1)
		logger('Expected a string message like Number required but got type ' + (typeof msg) + ' and a converted string value of "' + msg + '"');
	if (typeof msg === 'string' && msg.indexOf('line') === -1)
		logger('Expected to get a line number but did not find it');
};