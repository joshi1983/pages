import { argListToParameterValueTokens } from './function-calls/argListToParameterValueTokens.js';
import { directReplacements } from '../../../../../../command-groups/MathCommands.js';
import { fetchJson } from '../../../../../../fetchJson.js';
import { inlineListForMakeColor, isMakeColorCall } from './helpers/inlineListForMakeColor.js';
import { isBracketsNeededForArguments } from './helpers/isBracketsNeededForArguments.js';
import { ParseTreeTokenType } from '../../../../../../parsing/js-parsing/ParseTreeTokenType.js';
import { isSpecialFunction, processSpecialFunction } from './function-calls/processSpecialFunction.js';
import { processToken } from './processToken.js';
const argTypesToIgnore = new Set([
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.CURVED_RIGHT_BRACKET
]);

const migrationData = await fetchJson('json/logo-migrations/CodeHeartTurtleScript.json');
const generalJsToCommand = new Map([
['console.log', 'print']
]);
const commandsToInfo = new Map();
const mathJsToCommand = new Map([
	['atan2', 'arcTan2']
]);
for (let [key, js] of directReplacements) {
	const index = js.lastIndexOf('.');
	if (index !== -1)
		js = js.substring(index + 1);
	mathJsToCommand.set(js, key);
}

const jsFuncNameToWebLogoCommand = new Map();
migrationData.commands.forEach(function(commandInfo) {
	commandsToInfo.set(commandInfo.primaryName, commandInfo);
	if (commandInfo.names instanceof Array) {
		commandInfo.names.forEach(function(name) {
			commandsToInfo.set(name, commandInfo);
		});
	}
	let to;
	if (commandInfo.to !== undefined)
		to = commandInfo.to;
	else if (commandInfo.argLengthConditionalTo !== undefined)
		to = commandInfo.argLengthConditionalTo;
	jsFuncNameToWebLogoCommand.set(commandInfo.primaryName, to);
	if (commandInfo.names instanceof Array) {
		commandInfo.names.forEach(function(name) {
			jsFuncNameToWebLogoCommand.set(name, to);
		});
	}
});

function getDeepestName(token) {
	while (token.children.length !== 0)
		token = token.children[0];
	return token.val;
}

function getFullPath(token) {
	let result = '';
	while (token !== undefined) {
		if (typeof token.val === 'string')
			result += token.val;
		token = token.children[0];
	}
	return result;
}

function functionCallToCommandName(token) {
	const deepestName = getDeepestName(token);
	const info = commandsToInfo.get(deepestName);
	if (info !== undefined) {
		if (info.argLengthTos instanceof Array) {
			const tokenNumArgs = argListToParameterValueTokens(token.children[1]).length;
			for (const [numArgs, name] of info.argLengthTos) {
				if (numArgs === tokenNumArgs)
					return name;
			}
		}
		if (info.toProc !== undefined)
			return info.toProc;
	}
	let result = deepestName;
	let identifierToken;
	if (token.type === ParseTreeTokenType.IDENTIFIER)
		identifierToken = token;
	else {
		identifierToken = token.children[0];
		if (identifierToken !== undefined && identifierToken.type !== ParseTreeTokenType.IDENTIFIER)
			identifierToken = identifierToken.children[0];
	}
	if (identifierToken.children.length !== 0 &&
	identifierToken.children[0].type === ParseTreeTokenType.DOT) {
		if (identifierToken !== null) {
			if (identifierToken.val === 'Math') {
				const commandName = mathJsToCommand.get(deepestName);
				if (commandName !== undefined)
					result = commandName;
			}
			else {
				const path = getFullPath(identifierToken);
				const cmd = generalJsToCommand.get(path);
				if (cmd !== undefined)
					result = cmd;
			}
		}
	}
	else {
		const potentialResult = jsFuncNameToWebLogoCommand.get(deepestName);
		if (potentialResult !== undefined)
			result = potentialResult;
	}
	return result;
}

function shouldBeRemoved(funcCallToken) {
	const deepestName = getDeepestName(funcCallToken);
	if (typeof deepestName === 'string') {
		const info = commandsToInfo.get(deepestName);
		if (info !== undefined) {
			return info.removeInMigration === true;
		}
	}
}

export function processFunctionCall(token, result) {
	if (token.parentNode.type === ParseTreeTokenType.TREE_ROOT ||
	token.parentNode.type === ParseTreeTokenType.CODE_BLOCK) {
		result.processCommentsUpToToken(token);
	}
	if (shouldBeRemoved(token))
		return; // don't translate anything.
	if (isMakeColorCall(token)) {
		inlineListForMakeColor(token, result);
		return;
	}
	if (isSpecialFunction(token)) {
		processSpecialFunction(token, result);
		return;
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
			processToken(child, result);
		}
	}
	if (bracketsNeeded)
		result.append(')');
};