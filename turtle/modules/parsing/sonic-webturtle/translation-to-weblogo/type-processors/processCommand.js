import { processSpecialCommand } from './commands/processSpecialCommand.js';
import { processTokens } from './processTokens.js';
import { WebTurtleCommand } from '../../WebTurtleCommand.js';
import { Command } from '../../../Command.js';
await Command.asyncInit();

export function processCommand(token, result, settings) {
	const wtInfo = WebTurtleCommand.getCommandInfo(token.val);
	if (wtInfo !== undefined && wtInfo.returnTypes === null) {
		result.processCommentsUpToToken(token);
	}
	result.append(' ');
	if (processSpecialCommand(token, result, settings)) {
		result.append('\n');
		return;
	}
	let translatedName = token.val;
	if (wtInfo.to !== undefined) {
		translatedName = wtInfo.to;
		const webLogoCommandInfo = Command.getCommandInfo(translatedName);
		if (webLogoCommandInfo !== undefined && webLogoCommandInfo.returnTypes === null) {
			result.processCommentsUpToToken(token);
		}
	}
	else if (wtInfo.toProc !== undefined)
		translatedName = wtInfo.toProc;
	result.append(translatedName);
	processTokens(token.children, result, settings);
	result.append('\n');
};