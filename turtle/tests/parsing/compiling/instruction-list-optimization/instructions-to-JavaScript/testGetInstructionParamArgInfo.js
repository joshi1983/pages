import { CallCommandInstruction } from '../../../../../modules/parsing/execution/instructions/CallCommandInstruction.js';
import { Command } from '../../../../../modules/parsing/Command.js';
import { createRootToken } from '../../../../helpers/createRootToken.js';
import { getInstructionParamArgInfo } from '../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/getInstructionParamArgInfo.js';
await Command.asyncInit();

const rootToken = createRootToken();

export function testGetInstructionParamArgInfo(logger) {
	const forward = new CallCommandInstruction(Command.getCommandInfo('forward'), 1, rootToken);
	let types = getInstructionParamArgInfo(forward, 0).types;
	if (types !== 'num')
		logger('Expected "num" but got "' + types + '"');
	
	const localmake = new CallCommandInstruction(Command.getCommandInfo('localmake'), 2, rootToken);
	types = getInstructionParamArgInfo(localmake, 0).types;
	if (types !== 'string')
		logger('Expected "string" but got "' + types + '"');
	types = getInstructionParamArgInfo(localmake, 1).types;
	const expected = '*';
	if (types !== expected)
		logger(`Expected "${expected}" but got "${types}"`);

};