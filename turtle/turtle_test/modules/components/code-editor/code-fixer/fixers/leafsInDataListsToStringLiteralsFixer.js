/*
This should be run only after forLoopVariableFixer runs because 
this would cause all of its changes but log with less clear messages.
*/

import { Command } from '../../../../parsing/Command.js';
import { DataTypes } from '../../../../parsing/data-types/DataTypes.js';
import { isInstructionList } from '../../../../parsing/parse-tree-analysis/isInstructionList.js';
import { ParseTreeToken } from '../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
await ParseTreeToken.asyncInit();
await Command.asyncInit();

const listDataType = DataTypes.createFromName('list');

export function leafsInDataListsToStringLiteralsFixer(cachedParseTree, fixLogger) {
	const tokens = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).
	filter(function(token) {
		if (token.isBracketOrBinaryOperator() ||
		token.parentNode === null || token.parentNode.type !== ParseTreeTokenType.LIST ||
		token.val.charAt(0) === ',' || token.val.charAt(token.val.length - 1) === ',')
			return false;
		if (isInstructionList(token.parentNode))
			return false;
		else {
			// is the parent a data list or an instruction list?
			if (token.parentNode.parentNode === null)
				return false;
			if (ParseTreeTokenType.PARAMETERIZED_GROUP !== token.parentNode.parentNode.type)
				return false;

			const info = Command.getCommandInfo(token.parentNode.parentNode.val);
			if (info === undefined)
				return true; // if it was a procedure, procedures can't take instruction lists as input.

			const argTypes = Command.getParameterTypes(info, token.parentNode.parentNode.children.indexOf(token.parentNode));
			const dataTypes = new DataTypes(argTypes);
			return DataTypes.contains(dataTypes, listDataType);
		}
	});

	tokens.forEach(function(token) {
		const previousType = token.type;
		token.type = ParseTreeTokenType.STRING_LITERAL;
		cachedParseTree.tokenTypeChanged(token, previousType);
		fixLogger.log(`Added a quote before the string "${token.val}`, token);
	});
};