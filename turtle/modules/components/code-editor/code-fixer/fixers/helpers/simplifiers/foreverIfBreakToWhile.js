import { ArrayUtils } from
'../../../../../../ArrayUtils.js';
import { CommandCalls } from
'../../../../../../parsing/parse-tree-analysis/CommandCalls.js';
import { getAllDescendentsAsArray } from
'../../../../../../parsing/generic-parsing-utilities/getAllDescendentsAsArray.js';
import { getLastDescendentTokenOf } from
'../../../../../../parsing/generic-parsing-utilities/getLastDescendentTokenOf.js';
import { ParseTreeTokenType } from
'../../../../../../parsing/ParseTreeTokenType.js';
import { wrapInNot } from
'../wrapInNot.js';

function getInstructionListToken(foreverToken) {
	return foreverToken.children[0];
}

function getIfToken(foreverInstructionList) {
	if (typeof foreverInstructionList !== 'object')
		throw new Error(`foreverInstructionList must be an object but found ${foreverInstructionList}`);

	for (const child of foreverInstructionList.children) {
		if (!child.isBracket()) {
			if (CommandCalls.tokenMatchesPrimaryName(child, 'if'))
				return child;

			return;
		}
	}
}

function isBreakingImmediately(ifToken) {
	if (typeof ifToken !== 'object')
		throw new Error(`ifToken must be an object but found ${ifToken}`);

	const ifInstructionList = ifToken.children[1];
	if (ifInstructionList === undefined)
		return false;
	for (const child of ifInstructionList.children) {
		if (!child.isBracket()) {
			return CommandCalls.tokenMatchesPrimaryName(child, 'break');
		}
	}
}

function isOfInterest(token) {
	if (!CommandCalls.tokenMatchesPrimaryName(token, 'forever'))
		return false;

	const instructionList = getInstructionListToken(token);
	if (instructionList === undefined)
		return false;

	const ifToken = getIfToken(instructionList);
	if (ifToken === undefined)
		return false;

	if (!isBreakingImmediately(ifToken))
		return false;

	return true;
}

export function foreverIfBreakToWhile(cachedParseTree, fixLogger) {
	const forevers = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(isOfInterest);
	forevers.forEach(function(foreverToken) {
		const instructionListToken = getInstructionListToken(foreverToken);
		const ifToken = getIfToken(instructionListToken);
		const ifInstructionList = ifToken.children[1];
		const ifEndBracket = getLastDescendentTokenOf(ifToken);
		const conditionToken = ifToken.children[0];
		foreverToken.val = 'while';
		const instructionListOpenBracket = instructionListToken.children[0];
		// move parts of instruction list so if's condition becomes 
		// part of while's condition.
		instructionListOpenBracket.lineIndex = ifEndBracket.lineIndex;
		instructionListOpenBracket.colIndex = ifEndBracket.colIndex;
		
		const notToken = wrapInNot(conditionToken, cachedParseTree);
		// help the notToken be positioned before the condition.
		notToken.lineIndex = ifToken.lineIndex;
		notToken.colIndex = ifToken.colIndex;
		notToken.remove();
		foreverToken.insertAsFirstChild(notToken);
		ifToken.remove();
		const tokensRemoved = [ifToken, ifInstructionList];
		ArrayUtils.pushAll(tokensRemoved, getAllDescendentsAsArray(ifInstructionList));
		cachedParseTree.tokensRemoved(tokensRemoved);
		fixLogger.log(`Replaced forever and an if-statement with a while-loop because the while-loop is simpler, more readable code.`, foreverToken);
	});
};