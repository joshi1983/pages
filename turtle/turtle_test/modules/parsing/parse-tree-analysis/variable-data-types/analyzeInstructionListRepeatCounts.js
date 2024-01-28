import { analyzeInstructionListRepeatCountsBasic } from './analyzeInstructionListRepeatCountsBasic.js';
import { evaluateOutputFrequency } from './evaluateOutputFrequency.js';
import { getInstructionListRepeatCountAdvanced } from './getInstructionListRepeatCountAdvanced.js';
import { getInstructionListRepeatCountBasic } from './getInstructionListRepeatCountBasic.js';
import { isInstructionList } from '../isInstructionList.js';
import { OutputFrequency } from './OutputFrequency.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

function getSometimesTokensFrom(tokenToOutputFrequency) {
	const result = [];
	for (const [key, value] of tokenToOutputFrequency) {
		if (value === OutputFrequency.Sometimes)
			result.push(key);
	}
	return result;
}

export function analyzeInstructionListRepeatCounts(cachedParseTree, tokenValueMap) {
	const basicResult = analyzeInstructionListRepeatCountsBasic(cachedParseTree, tokenValueMap);
	const instructionLists = basicResult.instructionLists;
	const tokenToOutputFrequency = new Map();
	const repeatCounts = basicResult.repeatCounts;
	let somethingChanged = true;
	// run just a few passes to let repeat counts and output frequency data fill each other in.
	// The calculations are somewhat interdependent so a few passes help us get more precise results.
	for (let j = 0; j < 3 && somethingChanged; j++) {
		somethingChanged = false;
		// first pass to evaluate some tokenToOutputFrequency data.
		if (evaluateOutputFrequency(cachedParseTree, repeatCounts, tokenToOutputFrequency))
			somethingChanged = true;
		instructionLists.forEach(function(instructionList) {
			const repeatCount = getInstructionListRepeatCountAdvanced(instructionList, tokenValueMap, repeatCounts, tokenToOutputFrequency);
			if (repeatCount !== undefined) {
				repeatCounts.set(instructionList, repeatCount);
			}
		});
		const sometimesOutputTokens = getSometimesTokensFrom(tokenToOutputFrequency);
		if (sometimesOutputTokens.length !== 0) {
			sometimesOutputTokens.forEach(function(key) {
				tokenToOutputFrequency.delete(key);
			});
		}
	}

	return repeatCounts;
};