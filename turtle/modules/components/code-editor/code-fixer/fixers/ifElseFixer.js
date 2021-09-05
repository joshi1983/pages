import { Command } from '../../../../parsing/Command.js';
import { isInstructionList } from '../../../../parsing/parse-tree-analysis/isInstructionList.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
await Command.asyncInit();

const lowerCaseIfNames = Command.getLowerCaseCommandNameSet('if');

function isLikelyIntendedToBeAnInstructionList(token) {
	if (token === null || token.type !== ParseTreeTokenType.LIST)
		return false;
	const valueTokens = token.children.filter(tok => !tok.isBracket());
	if (valueTokens.length === 0)
		return true;
	let numGoodInstructionListTokens = 0;
	for (let i = 0; i < valueTokens.length; i++) {
		const tok = valueTokens[i];
		if (tok.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
			const info = Command.getCommandInfo(tok.val);
			if (info === undefined || info.isIndependentlyUseful !== false)
				numGoodInstructionListTokens++;
		}
	}
	return 0.5 < numGoodInstructionListTokens / valueTokens.length;
}

function isOfInterest(token) {
	return lowerCaseIfNames.has(token.val.toLowerCase()) &&
		isInstructionList(token.parentNode) &&
		isLikelyIntendedToBeAnInstructionList(token.nextSibling);
}

export function ifElseFixer(cachedParseTree, fixLogger) {
	const ifCalls = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(isOfInterest);

	ifCalls.forEach(function(ifCall) {
		const oldVal = ifCall.val;
		ifCall.val = 'ifelse';
		const next = ifCall.nextSibling;
		next.remove();
		ifCall.appendChild(next);

		cachedParseTree.tokenValueChanged(ifCall, oldVal);
		fixLogger.log(`Replaced if with ifelse because more than one instruction list was found for the if call.`, ifCall);
	});
};