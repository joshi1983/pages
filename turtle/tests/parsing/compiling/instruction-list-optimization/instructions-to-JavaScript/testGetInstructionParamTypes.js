import { CallCommandInstruction } from '../../../../../modules/parsing/execution/instructions/CallCommandInstruction.js';
import { Command } from '../../../../../modules/parsing/Command.js';
import { createRootToken } from '../../../../helpers/createRootToken.js';
import { getInstructionParamTypes } from '../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/getInstructionParamTypes.js';
await Command.asyncInit();

const rootToken = createRootToken();

export function testGetInstructionParamTypes(logger) {
	const forward = new CallCommandInstruction(Command.getCommandInfo('forward'), 1, rootToken);
	let types = getInstructionParamTypes(forward, 0);
	if (types !== 'num')
		logger('Expected "num" but got "' + types + '"');
	
	const localmake = new CallCommandInstruction(Command.getCommandInfo('localmake'), 2, rootToken);
	types = getInstructionParamTypes(localmake, 0);
	if (types !== 'string')
		logger('Expected "string" but got "' + types + '"');
	types = getInstructionParamTypes(localmake, 1);
	const expected = '*';
	if (types !== expected)
		logger(`Expected "${expected}" but got "${types}"`);

};