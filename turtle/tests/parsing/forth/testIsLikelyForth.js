import { ArrayUtils } from
'../../../modules/ArrayUtils.js';
import { bcplExamples } from
'../../helpers/parsing/bcplExamples.js';
import { cssExamples } from
'../../helpers/parsing/cssExamples.js';
import { forthExamples } from
'../../helpers/parsing/forthExamples.js';
import { hpglExamples } from
'../../helpers/parsing/hpglExamples.js';
import { isLikelyForth } from
'../../../modules/parsing/forth/isLikelyForth.js';
import { povRayExamples } from
'../../helpers/parsing/povRayExamples.js';
import { processingExamples } from
'../../helpers/parsing/processingExamples.js';
import { testInOutPairs } from
'../../helpers/testInOutPairs.js';

const nonExamples = [];
const arrays = [bcplExamples, cssExamples, hpglExamples, povRayExamples, processingExamples];
for (const array of arrays) {
	ArrayUtils.pushAll(nonExamples, array);
}

export function testIsLikelyForth(logger) {
	const cases = forthExamples.map(code => {
		return {
			'in': code,
			'out': true
		};
	});
	nonExamples.forEach(function(code) {
		cases.push({
			'in': code,
			'out': false
		});
	});
	
	testInOutPairs(cases, isLikelyForth, logger);
};