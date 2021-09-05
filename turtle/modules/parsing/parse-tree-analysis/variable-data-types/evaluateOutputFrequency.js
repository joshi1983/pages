import { evaluateOutputFrequencyBasic } from './evaluateOutputFrequencyBasic.js';
import { getOutputFrequencyAdvanced } from './getOutputFrequencyAdvanced.js';
import { OutputFrequency } from './OutputFrequency.js';

// result can be specified if you want to do a second pass with more informative repeatCounts data.
export function evaluateOutputFrequency(cachedParseTree, repeatCounts, result) {
	let instructionLists = evaluateOutputFrequencyBasic(cachedParseTree, result);
	let somethingChanged;
	let overallSomethingChanged = false;
	do {
		let somethingChanged = false;
		instructionLists = instructionLists.filter(t => !result.has(t));
		for (let i = 0; i < instructionLists.length; i++) {
			const token = instructionLists[i];
			const res = getOutputFrequencyAdvanced(token, result, repeatCounts);
			if (res !== undefined) {
				result.set(token, res);
				somethingChanged = true;
				overallSomethingChanged = true;
			}
		}
	} while (somethingChanged);

	instructionLists = instructionLists.filter(t => !result.has(t));
	// any lists that couldn't be evaluated in a more decisive way will be marked as Maybe outputting.
	for (let i = 0; i < instructionLists.length; i++) {
		result.set(instructionLists[i], OutputFrequency.Sometimes);
	}
	return overallSomethingChanged;
};