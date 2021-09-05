import { Command } from '../../../Command.js';

function sublist(callToken, tokenValuesMap, tokenLengthsMap) {
	const fromIndex = tokenValuesMap.get(callToken.children[1]);
	const toIndex = tokenValuesMap.get(callToken.children[2]);
	if (Number.isInteger(fromIndex) && Number.isInteger(toIndex) && toIndex >= fromIndex) {
		return toIndex + 1 - fromIndex;
	}
}

function vectorScale(callToken, tokenValuesMap, tokenLengthsMap) {
	if (callToken.children.length === 0)
		return;
	return tokenLengthsMap.get(callToken.children[0]);
}

function vectorAdd(callToken, tokenValuesMap, tokenLengthsMap) {
	const lengths1 = tokenLengthsMap.get(callToken.children[0]);
	const lengths2 = tokenLengthsMap.get(callToken.children[1]);
	if (lengths1 === undefined)
		return lengths2;
	if (lengths2 === undefined)
		return lengths1;
	return lengths1;
}

const commandsObject = new Map([
	['sublist', sublist],
	['vectorAdd', vectorAdd],
	['vectorProject', vectorAdd],
	['vectorScale', vectorScale],
	['vectorSubtract', vectorAdd]
]);
const commandNamesOfInterest = Array.from(commandsObject.keys());

export function analyzeTokenLengthsForCommandCalls(cachedParseTree, tokenValuesMap, tokenLengthsMap) {
	const commandCalls = cachedParseTree.getCommandCallsByNames(commandNamesOfInterest).filter(token => !tokenLengthsMap.has(token));
	commandCalls.forEach(function(commandCall) {
		const info = Command.getCommandInfo(commandCall.val);
		const lengthInfo = commandsObject.get(info.primaryName)(commandCall, tokenValuesMap, tokenLengthsMap);
		if (lengthInfo !== undefined)
			tokenLengthsMap.set(commandCall, lengthInfo);
	});
};