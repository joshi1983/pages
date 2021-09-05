import { longestCommonSubsequence } from '../modules/longestCommonSubsequence.js';
import { prefixWrapper } from './helpers/prefixWrapper.js';

export function testLongestCommonSubsequence(logger) {
	const cases = [
		{'in': ['hello', 'll'], 'result': 2},
		{'in': ['hello', 'ha'], 'result': 1},
		{'in': ['hello', 'q'], 'result': 0},
		{'in': ['hello', 'hll'], 'result': 3},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, in = "${caseInfo.in[0]}" and "${caseInfo.in[1]}"`, logger);
		const result = longestCommonSubsequence(caseInfo.in[0], caseInfo.in[1]);
		if (result !== caseInfo.result)
			plogger(`Expected ${caseInfo.result} but got ${result}`);
		
		// test with inputs swapped because the order should not change the result.
		const result2 = longestCommonSubsequence(caseInfo.in[1], caseInfo.in[0]);
		if (result2 !== caseInfo.result)
			plogger(`With swapped inputs, expected ${caseInfo.result} but got ${result2}`);
	});
};