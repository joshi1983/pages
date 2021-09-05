import { analyzeLengthForVariable } from './analyzeLengthForVariable.js';
import { analyzeListCommandCalls } from './analyzeListCommandCalls.js';
import { Command } from '../../../Command.js';
import { getTokensByType } from '../../cached-parse-tree/getTokensByType.js';
import { getTokensByTypes } from '../../cached-parse-tree/getTokensByTypes.js';
import { isInstructionList } from '../../isInstructionList.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { SetUtils } from '../../../../SetUtils.js';
await Command.asyncInit();
const commandNamesOfInterest = new Set();
Command.getAllCommandsInfo().forEach(function(info) {
	const length = info.returnLengthInfo;
	if (length !== undefined) {
		if (length.min === length.max) {
			SetUtils.addAll(commandNamesOfInterest, Command.getLowerCaseCommandNameSet(info));
		}
	}
});

function getListLength(token) {
	const children = token.children;
	let result = children.length;
	let i = 0;
	while (i < children.length) {
		if (!children[i].isBracket())
			break;
		i++;
		result--;
	}
	let j = children.length - 1;
	while (j > i) {
		if (!children[j].isBracket())
			break;
		j--;
		result--;
	}
	return result;
}

export function analyzeLengthsBasic(cachedParseTree, procedureCallsMayChangeLength) {
	if (typeof procedureCallsMayChangeLength !== 'boolean')
		throw new Error(`procedureCallsMayChangeLength must be boolean but got ${procedureCallsMayChangeLength}`);
	const result = new Map();
	const tokensOfInterest = getTokensByTypes(cachedParseTree, [
		ParseTreeTokenType.LIST,
		ParseTreeTokenType.LONG_STRING_LITERAL,
		ParseTreeTokenType.STRING_LITERAL
	]).filter(token => !isInstructionList(token));
	for (let i = 0; i < tokensOfInterest.length; i++) {
		const token = tokensOfInterest[i];
		if (token.isStringLiteral())
			result.set(token, token.val.length);
		else
			result.set(token, getListLength(token));
	}
	getTokensByType(cachedParseTree, ParseTreeTokenType.PARAMETERIZED_GROUP).
	filter(token => commandNamesOfInterest.has(token.val.toLowerCase())).
	forEach(function(callToken) {
		const info = Command.getCommandInfo(callToken.val);
		result.set(callToken, info.returnLengthInfo.min);
	});
	analyzeListCommandCalls(cachedParseTree, result);
	for (const [token, lengthInfo] of result) {
		analyzeLengthForVariable(cachedParseTree, result, token, procedureCallsMayChangeLength);
	}
	return result;
};