import { ArrayUtils } from
'../../../../../modules/ArrayUtils.js';
import { batchExamples } from
'../../../../helpers/parsing/batchExamples.js';
import { isLikelyTuring } from
'../../../../../modules/parsing/other-languages/pascal/turing/isLikelyTuring.js';
import { povRayExamples } from
'../../../../helpers/parsing/povRayExamples.js';
import { processingExamples } from
'../../../../helpers/parsing/processingExamples.js';
import { qbasicExamples } from
'../../../../helpers/parsing/basic/qbasicExamples.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { turingExamples } from
'../../../../helpers/parsing/pascal/turingExamples.js';

const nonExamples = ArrayUtils.combine(batchExamples,
povRayExamples, processingExamples, qbasicExamples);

export function testIsLikelyTuring(logger) {
	const cases = [];
	turingExamples.forEach(function(code) {
		cases.push({
			'in': code,
			'out': true
		});
	});
	nonExamples.forEach(function(code) {
		cases.push({
			'in': code,
			'out': false
		});
	});
	testInOutPairs(cases, isLikelyTuring, logger);
};