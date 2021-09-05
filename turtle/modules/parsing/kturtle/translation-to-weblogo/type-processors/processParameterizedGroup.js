import { Command } from '../../../Command.js';
import { KTurtleCommand } from '../../KTurtleCommand.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processToken } from './processToken.js';
await Command.asyncInit();

const listToNames = new Set([
	'setPenColor',
	'setScreenColor'
]);

function shouldWrapArgsAsList(token, numCleanChildren) {
	const info = KTurtleCommand.getCommandInfo(token.val);
	if (info === undefined)
		return false;
	let webLogoCommandInfo;
	if (info.to !== undefined)
		webLogoCommandInfo = Command.getCommandInfo(info.to);
	else if (info.argLengthConditionalTo !== undefined)
		webLogoCommandInfo = Command.getCommandInfo(info.argLengthConditionalTo);
	if (webLogoCommandInfo === undefined)
		return false;
	const numWebLogoArgs = Command.getArgCount(webLogoCommandInfo);
	if (numCleanChildren === numWebLogoArgs.defaultCount)
		return false;
	return listToNames.has(webLogoCommandInfo.primaryName);
}

export function processParameterizedGroup(token, result) {
	const cleanChildren = token.children.filter(c => c.type !== ParseTreeTokenType.COMMA);
	const isWrappingArgsAsList = shouldWrapArgsAsList(token, cleanChildren.length);
	const info = KTurtleCommand.getCommandInfo(token.val);
	if (info !== undefined) {
		if (info.removeInMigration === true)
			return; // don't add any translation.
		if (info.to !== undefined)
			result.append(info.to);
		else if (info.toProc !== undefined)
			result.append(info.toProc);
		else if (info.argLengthConditionalTo !== undefined) {
			const webLogoInfo = Command.getCommandInfo(info.argLengthConditionalTo);
			if (webLogoInfo.args.length === cleanChildren.length || isWrappingArgsAsList)
				result.append(webLogoInfo.primaryName);
			else
				result.append(token.val);
		}
		else 
			result.append(token.val);
	}
	else
		result.append(token.val);
	result.append(' ');
	if (isWrappingArgsAsList)
		result.append('[');
	for (let i = 0; i < cleanChildren.length; i++) {
		const child = cleanChildren[i];
		processToken(child, result);
		result.append(' ');
	}
	if (isWrappingArgsAsList) {
		result.trimRight();
		result.append(']');
	}
};