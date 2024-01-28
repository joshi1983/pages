import { Command } from './Command.js';
import { ParseTreeToken } from './ParseTreeToken.js';
import { ParseTreeTokenType } from './ParseTreeTokenType.js';

export async function asyncInit() {
	await Command.asyncInit();
	await ParseTreeToken.asyncInit();
};

export function getNumberOfArguments(token, procedures) {
	const lowerCaseName = token.val.toLowerCase();
	if (procedures.has(lowerCaseName))
		return procedures.get(lowerCaseName).parameters.length;
	else {
		const commandInfo = Command.getCommandInfo(token.val);
		const count = Command.getArgCount(commandInfo);
		// Some commands can use an arbitrary number of arguments if called within a curved-bracket expression.
		// For example, "print (sum 1 2 3)"
		if (count.isFlexible &&
		token.parentNode.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION &&
		token.parentNode.children[1] === token) {
			return token.parentNode.children.length - 3;
		}

		return count.defaultCount;
	}
};

function isLimitingParentType(type) {
	return [ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
		ParseTreeTokenType.TREE_ROOT,
		ParseTreeTokenType.LIST].indexOf(type) !== -1;
}

function getHighestLimitedToken(token, isLookingDeeperAtLists) {
	while (token.nextSibling === null) {
		const parentType = token.parentNode.type;
		if (isLimitingParentType(parentType)) {
			if (!isLookingDeeperAtLists || parentType !== ParseTreeTokenType.LIST)
				break;
			else if (isLookingDeeperAtLists && parentType === ParseTreeTokenType.LIST) {
				if (token.parentNode.parentNode !== null && [
					ParseTreeTokenType.TREE_ROOT, ParseTreeTokenType.PROCEDURE_START_KEYWORD
				].indexOf(token.parentNode.parentNode.type) !== -1)
					break;
			}
		}
		token = token.parentNode;
	}
	return token;
}

function getParameterTokenAfter(token, isLookingDeeperAtLists) {
	token = getHighestLimitedToken(token, isLookingDeeperAtLists);

	token = token.nextSibling;

	return token;
}

export function processLeafToken(token, procedures, parseLogger, isLookingDeeperAtLists) {
	const numArgs = getNumberOfArguments(token, procedures);
	const parameters = [];
	var currentToken = token;
	while (token.children.length + parameters.length < numArgs) {
		currentToken = getParameterTokenAfter(currentToken, isLookingDeeperAtLists);
		if (currentToken === null) {
			const info = Command.getCommandInfo(token.val);
			let msg = `Expected ${numArgs} parameter${numArgs === 1 ? '' : 's'} but found only ${parameters.length}`;
			if (info !== undefined && info.primaryName === 'to')
				msg = '"to" is used to start a procedure.  You are incorrectly using it.';
			if (info !== undefined) {
				msg += `  Learn more about the command by clicking <span class="command">${info.primaryName}</span>.`;
			}
			parseLogger.error(msg, token, info !== undefined);
			return false;
		}
		else if (currentToken.isBracket()) {
			const info = Command.getCommandInfo(token.val);
			let extra = `. This applies to a procedure named ${token.val}.`;
			if (info !== undefined)
				extra = `. Click to learn more about the <span class="command">${info.primaryName} command</span>.`;
			parseLogger.error(`Expected ${numArgs} parameters but found ${currentToken.val} instead of parameter ${parameters.length + 1}${extra}`, token, info !== undefined);
			return false;
		}
		else {
			parameters.push(currentToken);
		}
	}
	parameters.forEach(function(parameter) {
		parameter.remove();
	});
	token.type = ParseTreeTokenType.PARAMETERIZED_GROUP;
	parameters.forEach(function(parameter) {
		token.appendChild(parameter);
	});
	return true;
};

function processLeafTokens(tokens, procedures, parseLogger, isLookingDeeperAtLists) {
	let allSucceeded = true;
	for (let i = tokens.length - 1; i >= 0; i--) {
		const token = tokens[i];
		if (processLeafToken(token, procedures, parseLogger, isLookingDeeperAtLists) === false)
			allSucceeded = false;
	}
	return allSucceeded; // indicate success.
}

function isProcedureNameToken(token) {
	return (token.parentNode !== null &&
		typeof token.parentNode.val === 'string' &&
		token.parentNode.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD);
}

function sanitizeParameterGroups(parseTreeToken, procedures, parseLogger) {
	// get groups with invalid numbers of children.
	const groupTokens = ParseTreeToken.flatten(parseTreeToken).filter(function(token) {
		if (token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
			return false;
		const numArgs = getNumberOfArguments(token, procedures);
		return numArgs > token.children.length;
	});
	if (groupTokens.length !== 0) {
		processLeafTokens(groupTokens, procedures, parseLogger, true);
	}
}

export function createParameterizedGroups(parseTreeToken, procedures, parseLogger) {
	if (procedures === undefined)
		procedures = new Map();
	if (!(procedures instanceof Map))
		throw new Error('procedures expected to be undefined or a Map from name to Procedure instance');
	const startTokens = ParseTreeToken.flatten(parseTreeToken).filter(function(token) {
		return token.type === ParseTreeTokenType.LEAF &&
			token.parentNode !== null &&
			!isProcedureNameToken(token) &&
			(procedures.has(token.val.toLowerCase()) || Command.getCommandInfo(token.val) !== undefined);
	});
	const unusedReturnValueTokens = startTokens.filter(function(token) {
		return (token.parentNode.parentNode !== null &&
			token.parentNode.parentNode.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD);
	});
	processLeafTokens(unusedReturnValueTokens, procedures, parseLogger, false);

	const remainingTokens = startTokens.filter(function(token) {
		return token.type === ParseTreeTokenType.LEAF &&
			unusedReturnValueTokens.indexOf(token) === -1;
	});
	processLeafTokens(remainingTokens, procedures, parseLogger, false);
	sanitizeParameterGroups(parseTreeToken, procedures, parseLogger);
};