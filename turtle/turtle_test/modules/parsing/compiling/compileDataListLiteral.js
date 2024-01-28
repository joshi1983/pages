import { CallCommandInstruction } from '../execution/instructions/CallCommandInstruction.js';
import { Command } from '../Command.js';
import { getInstructionsFromToken } from './compileParameters.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
await Command.asyncInit();
const listCommandInfo = Command.getCommandInfo('list');

export function compileDataListLiteral(listToken, procedures, result, logger) {
	if (typeof listToken !== 'object' || listToken instanceof Array)
		throw new Error('listToken must be a single ParseTreeToken.  Not an Array');
	if (listToken.type !== ParseTreeTokenType.LIST)
		throw new Error('compileDataListLiteral requires listToken to be of type LIST.  Instead got ' + ParseTreeTokenType.getNameFor(listToken.type));

	const dataListTokens = listToken.children.slice(1, listToken.children.length - 1);
	dataListTokens.forEach(function(token) {
		getInstructionsFromToken(token, procedures, result, logger);
	});
	result.push(new CallCommandInstruction(listCommandInfo, dataListTokens.length, listToken));
};