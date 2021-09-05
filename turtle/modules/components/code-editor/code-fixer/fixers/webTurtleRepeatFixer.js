import { compareTokenLocations } from '../../../../parsing/parse-tree-token/compareTokenLocations.js';
import { getParseTokensSorted } from '../../../../parsing/parse-tree-token/getParseTokensSorted.js';
import { getTokenAfter } from './getTokenAfter.js';
import { ParseTreeToken } from '../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
await ParseTreeToken.asyncInit();

function getNextCalls(cachedParseTree) {
	return cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).
		filter(token => token.val.toLowerCase() === 'next');
}

function sortByNestingLevel(repeatCalls, nextCalls) {
	const allTokens = repeatCalls.concat(nextCalls);
	getParseTokensSorted(allTokens);
	let level = 0;
	const tokenLevelMap = new Map();
	for (let i = 0; i < allTokens.length; i++) {
		const token = allTokens[i];
		if (token.val.toLowerCase() === 'repeat') {
			tokenLevelMap.set(token, level);
			level++;
		}
		else
			level = Math.max(0, level - 1); 
			// decrement while keeping the level at least 0.
			// negative isn't realistic.
	}
	repeatCalls.sort(function(repeatCall1, repeatCall2) {
		const level1 = tokenLevelMap.get(repeatCall1);
		const level2 = tokenLevelMap.get(repeatCall2);
		if (level1 === level2)
			return compareTokenLocations(repeatCall1, repeatCall2);
		else
			return level2 - level1;
	});
}

export function webTurtleRepeatFixer(cachedParseTree, fixLogger) {
	const nextCalls = getNextCalls(cachedParseTree);
	if (nextCalls.length === 0)
		return; // nothing to fix here.
	getParseTokensSorted(nextCalls);
	const lastNextCall = nextCalls[nextCalls.length - 1];
	const repeatCallsNeedingFix = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(token =>
		token.val.toLowerCase() === 'repeat' &&
		(token.children.length !== 2 || token.children[1].type !== ParseTreeTokenType.LIST) &&
		compareTokenLocations(token, lastNextCall) < 0);
	if (repeatCallsNeedingFix.length === 0)
		return; // nothing to fix
	
	// sort to process the most deeply nested repeat call and next pairs first.
	sortByNestingLevel(repeatCallsNeedingFix, nextCalls);
	// This is to improve the probability of matching the repeat call and next calls correctly.

	repeatCallsNeedingFix.forEach(function(repeatCall) {
		const nextCall = getTokenAfter(nextCalls, repeatCall);
		if (nextCall.parentNode === repeatCall) {
			repeatCall.removeChild(nextCall);
		}
		const repeatCountToken = repeatCall.children[0];
		const instructionListToken = new ParseTreeToken(null, null, repeatCountToken.lineIndex, repeatCountToken.colIndex + 1, ParseTreeTokenType.LIST);
		const firstBracket = new ParseTreeToken('[', null, repeatCountToken.lineIndex, repeatCountToken.colIndex+1, ParseTreeTokenType.LEAF);
		repeatCall.appendChild(instructionListToken);
		// Add the repeated instructions as children of instructionListToken.
		instructionListToken.appendChild(firstBracket);
		let firstNestedInstructionToken = repeatCall.nextSibling;
		if (repeatCall.children.length > 1)
			firstNestedInstructionToken = repeatCall.children[1];
		for (let n = firstNestedInstructionToken; n !== null && compareTokenLocations(n, nextCall) < 0;) {
			const oldN = n;
			if (n.nextSibling === null) {
				if (n.parentNode === repeatCall && repeatCall.nextSibling !== null)
					n = repeatCall.nextSibling;
				else {
					if (n.parentNode === repeatCall || n.parentNode === null)
						break;
					n = n.parentNode.nextSibling;
				}
			}
			else
				n = n.nextSibling;
			if (instructionListToken !== oldN) {
				oldN.remove();
				instructionListToken.appendChild(oldN);
			}
		}
		if (nextCall.parentNode !== null)
			nextCall.remove();
		instructionListToken.appendChild(nextCall);
		const oldValue = nextCall.val;
		nextCall.val = ']';
		cachedParseTree.tokenValueChanged(nextCall, oldValue);
		cachedParseTree.tokensAdded([firstBracket, instructionListToken]);

		// remove the updated nextCall from nextCalls 
		// since it isn't "next" anymore.
		const nextCallIndex = nextCalls.indexOf(nextCall);
		nextCalls.splice(nextCallIndex, 1);

		fixLogger.log(`Replaced ${oldValue} with ] because WebLogo groups instructions for repeat using square brackets.`, nextCall);
	});
};