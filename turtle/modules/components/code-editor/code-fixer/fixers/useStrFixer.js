import { ArrayUtils } from '../../../../ArrayUtils.js';
import { Command } from '../../../../parsing/Command.js';
import { compareTokenLocations } from '../../../../parsing/parse-tree-token/compareTokenLocations.js';
import { DataTypes } from '../../../../parsing/data-types/DataTypes.js';
import { getFirstDescendentTokenOf } from '../../../../parsing/parse-tree-token/getFirstDescendentTokenOf.js';
import { getTokenTypesBasic } from '../../../../parsing/parse-tree-analysis/variable-data-types/getTokenTypesBasic.js';
import { ParseTreeToken } from '../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
await Command.asyncInit();
await ParseTreeToken.asyncInit();

const matchingTypes = new Set(['list|string', 'string']);
const stringTypes = new DataTypes('string');
const numberTypes = new DataTypes('num');
const commandsRequiringString = Command.getAllCommandsInfo().
	filter(info => info.primaryName !== 'to' &&
		info.args instanceof Array &&
		info.args.some(argInfo => matchingTypes.has(argInfo.types))
	);
const stringRequiringNamesArray = [];
commandsRequiringString.forEach(function(info) {
	const nameSet = Command.getLowerCaseCommandNameSet(info);
	ArrayUtils.pushAll(stringRequiringNamesArray, Array.from(nameSet));
});
const stringRequiringCommandNames = new Set(stringRequiringNamesArray);

/*
Adds a call to 'str' command to fix situations where a string is required 
as an argument but the specified type is not a string.
*/
export function useStrFixer(cachedParseTree, fixLogger) {
	const callTokens = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(token => stringRequiringCommandNames.has(token.val.toLowerCase()) &&
			token.children.length !== 0);
	callTokens.forEach(function(callToken) {
		const info = Command.getCommandInfo(callToken.val);
		const argCount = Command.getArgCount(info);
		const numChildren = Math.min(callToken.children.length, argCount.defaultCount);
		for (let i = 0; i < numChildren; i++) {
			const argInfo = info.args[i];
			if (matchingTypes.has(argInfo.types)) {
				const child = callToken.children[i];
				if (child.type === ParseTreeTokenType.NUMBER_LITERAL)
					continue;
				const possibleDataTypes = getTokenTypesBasic(child, false);
				if (possibleDataTypes !== undefined && !possibleDataTypes.hasIntersectionWith(stringTypes) &&
				possibleDataTypes.hasIntersectionWith(numberTypes)) {
					// use str command.
					const firstDescendent = getFirstDescendentTokenOf(child);
					const earliestChildToken = compareTokenLocations(child, firstDescendent) < 0 ? child : firstDescendent;
					const strToken = new ParseTreeToken('str', null, earliestChildToken.lineIndex, earliestChildToken.colIndex - 1, ParseTreeTokenType.PARAMETERIZED_GROUP);
					callToken.appendChild(strToken);
					callToken.removeChild(child);
					strToken.appendChild(child);
					cachedParseTree.tokenAdded(strToken);
					fixLogger.log(`Converted a possible number to a string by adding the str command.`, strToken);
				}
			}
		}
	});
};