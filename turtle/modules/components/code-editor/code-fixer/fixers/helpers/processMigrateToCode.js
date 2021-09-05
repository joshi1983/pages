import { getAllDescendentsAsArray } from
'../../../../../parsing/generic-parsing-utilities/getAllDescendentsAsArray.js';
import { getArgCount } from
'../../../../../parsing/generic-parsing-utilities/getArgCount.js';
import { LogoParser } from
'../../../../../parsing/LogoParser.js';
import { moveArgsForParameterizedGroup } from
'./moveArgsForParameterizedGroup.js';
import { ParseLogger } from
'../../../../../parsing/loggers/ParseLogger.js';
import { ParseTreeTokenType } from
'../../../../../parsing/ParseTreeTokenType.js';

function isCommandOfInterest(commandInfo) {
	return commandInfo.migrateToCode !== undefined;
}

function isTokenOfInterest(commands, names) {
	return function(token) {
		return names.has(token.val.toLowerCase());
	};
}

function replaceToken(token, code, cachedParseTree) {
	const parseLogger = new ParseLogger();
	const tree = LogoParser.getParseTree(code, parseLogger);
	const firstChild = tree.children[0];
	if (token.val !== firstChild.val) {
		const oldVal = token.val;
		token.val = firstChild.val;
		cachedParseTree.tokenValueChanged(token, oldVal);
	}
	if (token.type !== firstChild.type) {
		const oldType = token.type;
		token.type = firstChild.type;
		cachedParseTree.tokenTypeChanged(token, oldType);
	}
	const descendents = getAllDescendentsAsArray(firstChild);
	for (const descendent of descendents) {
		if (descendent.lineIndex === 0)
			descendent.colIndex += token.colIndex;
		descendent.lineIndex += token.lineIndex;
	}
	for (const child of firstChild.children) {
		child.remove();
		token.appendChild(child);
	}
	cachedParseTree.tokensAdded(descendents);
}

function removeTokens(result, from) {
	for (const tok of from) {
		tok.remove();
		result.push(tok);
	}
}

export function processMigrateToCode(cachedParseTree, fixLogger, info) {
	const commandsOfInterest = info.commands.filter(isCommandOfInterest);
	if (commandsOfInterest.length === 0)
		return; // save some execution time by skipping the following work when 
	const names = new Map();
	for (const info of commandsOfInterest) {
		names.set(info.primaryName.toLowerCase(), info);
		if (info.names instanceof Array) {
			for (const name of info.names)
				names.set(name.toLowerCase(), info);
		}
	}
	const tokensOfInterest = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).
		filter(isTokenOfInterest(commandsOfInterest, names));
	tokensOfInterest.forEach(function(token) {
		const info = names.get(token.val.toLowerCase());
		const argCount = getArgCount(info, token);
		const code = info.migrateToCode;
		const removed = [];
		let tok = token;
		moveArgsForParameterizedGroup(token, argCount);
		for (let i = 0; tok !== null && i < argCount; i++) {
			const nextToken = tok.nextSibling;
			removeTokens(removed, getAllDescendentsAsArray(tok));
			tok = nextToken;
		}
		replaceToken(token, code, cachedParseTree);
		cachedParseTree.tokensRemoved(removed);
		fixLogger.log(`Replaced call to ${token.val} with ${code}`, token);
	});
};