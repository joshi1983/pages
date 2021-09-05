import { getInstructionsFrom } from './getInstructionsFrom.js';
import { ParseTreeToken } from '../ParseTreeToken.js';

export function addInstructionsFromCommandList(commandListToken, procedures, result, logger) {
	if (!(commandListToken instanceof ParseTreeToken))
		throw new Error('commandListToken must be a ParseTreeToken.  commandListToken specifeid as ', commandListToken);
	const bodyTokens = commandListToken.children.slice(1, commandListToken.getChildCount() - 1);
	getInstructionsFrom(bodyTokens, procedures, logger, result);
};