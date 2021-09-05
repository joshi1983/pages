import { ArrayUtils } from
'../../../../modules/ArrayUtils.js';
import { batchExamples } from
'../../../helpers/parsing/batchExamples.js';
import { isLikelyBatch } from
'../../../../modules/parsing/other-languages/batch/isLikelyBatch.js';
import { phpExamples } from
'../../../helpers/parsing/phpExamples.js';
import { processingExamples } from
'../../../helpers/parsing/processingExamples.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

const nonExamples = ArrayUtils.combine(phpExamples, processingExamples);

export function testIsLikelyBatch(logger) {
	const cases = [];
	batchExamples.forEach(function(code) {
		cases.push({
			'in': code,
			'out': true
		});
	});
	nonExamples.forEach(function(content) {
		cases.push({'in': content, 'out': false});
	});
	testInOutPairs(cases, isLikelyBatch, logger);
};