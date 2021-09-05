import { argListToParameterValueTokens } from './function-calls/argListToParameterValueTokens.js';
import { directReplacements } from '../../../../command-groups/MathCommands.js';
import { fetchJson } from '../../../../fetchJson.js';
import { functionCallToCommandNameInfo } from './function-calls/functionCallToCommandNameInfo.js';
import { isBracketsNeededForArguments } from './helpers/isBracketsNeededForArguments.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
const migrationCommands = await fetchJson('json/JavaScript/commands.json');
const generalJsToCommand = new Map();
export { generalJsToCommand };
const commandsToInfo = new Map();
migrationCommands.forEach(function(caseInfo) {
	commandsToInfo.set(caseInfo.primaryName, caseInfo);
});
export { commandsToInfo };
const mathJsToCommand = new Map();

for (let [key, js] of directReplacements) {
	const index = js.lastIndexOf('.');
	if (index !== -1)
		js = js.substring(index + 1);
	mathJsToCommand.set(js, key);
}

export function getDeepestName(token) {
	while (token.children.length !== 0)
		token = token.children[0];
	return token.val;
};

export function getFullPath(token) {
	let result = '';
	while (token !== undefined) {
		if (typeof token.val === 'string')
			result += token.val;
		token = token.children[0];
	}
	return result;
};

function functionCallToCommandName(token) {
	const deepestName = getDeepestName(token);
	const commandNameInfo = functionCallToCommandNameInfo(deepestName, token, commandsToInfo);
	if (commandNameInfo.identifierToken === undefined)
		return commandNameInfo.result;
	let result = commandNameInfo.result;
	const identifierToken = commandNameInfo.identifierToken;
	if (identifierToken.children.length !== 0 &&
	identifierToken.children[0].type === ParseTreeTokenType.DOT) {
		if (identifierToken !== null) {
			if (identifierToken.val === 'Math') {
				const commandName = mathJsToCommand.get(deepestName);
				if (commandName !== undefined)
					return commandName;
			}
		}
	}
	return result;
}

export function processFunctionCall(processToken) {
	return function(token, result, settings) {
		if (token.parentNode.type === ParseTreeTokenType.TREE_ROOT ||
		token.parentNode.type === ParseTreeTokenType.CODE_BLOCK) {
			result.processCommentsUpToToken(token);
		}
		const commandName = functionCallToCommandName(token);
		let bracketsNeeded = isBracketsNeededForArguments(commandName, token);
		if (bracketsNeeded)
			result.append('(');
		result.append(commandName);
		if (token.children.length > 1) {
			const argsListToken = token.children[1];
			const deepestName = getDeepestName(token);
			const migrationCommandInfo = commandsToInfo.get(deepestName);
			const children = argsListToken.children.slice();
			if (migrationCommandInfo !== undefined && migrationCommandInfo.reverseArgs)
				children.reverse();
			for (let child of argListToParameterValueTokens(children)) {
				result.append(' ');
				processToken(child, result, settings);
			}
		}
		if (bracketsNeeded)
			result.append(')');
	};
};