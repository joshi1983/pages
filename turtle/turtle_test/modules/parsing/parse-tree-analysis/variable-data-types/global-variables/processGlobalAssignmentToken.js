import { Command } from '../../../Command.js';

export function processGlobalAssignmentToken(token) {
	const info = Command.getCommandInfo(token.val);
	let assignToken = token, fromToken, varName, types;
	if (info.primaryName === 'make') {
		
	}
};