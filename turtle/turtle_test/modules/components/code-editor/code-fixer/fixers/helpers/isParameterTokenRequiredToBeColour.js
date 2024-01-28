import { Command } from '../../../../../parsing/Command.js';
import { ParseTreeTokenType } from '../../../../../parsing/ParseTreeTokenType.js';
await Command.asyncInit();

const typesUsingColour = new Set(['alphacolor', 'alphacolor|transparent', 'color', 'color|transparent', 'int', 'num']);
const commandsUsingColour = new Set(Command.getAllCommandsInfo().filter(function(info) {
	return info.args.some(arg => typesUsingColour.has(arg.types));
}).map(info => info.primaryName));

export function isParameterTokenRequiredToBeColour(t) {
	if (t.parentNode === null || t.parentNode.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;
	const info = Command.getCommandInfo(t.parentNode.val);
	if (info === undefined)
		return false;
	if (!commandsUsingColour.has(info.primaryName))
		return false;
	const argIndex = t.parentNode.children.indexOf(t);
	if (info.args.length <= argIndex)
		return false;
	const types = info.args[argIndex].types;
	return typesUsingColour.has(types);	
};