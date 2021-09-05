import { adaExamples } from
'../../helpers/parsing/adaExamples.js';
import { ArrayUtils } from
'../../../modules/ArrayUtils.js';
import { holyCExamples } from
'../../helpers/parsing/holyCExamples.js';
import { isLikelyAda } from
'../../../modules/parsing/ada/isLikelyAda.js';
import { processingExamples } from
'../../helpers/parsing/processingExamples.js';
import { testInOutPairs } from
'../../helpers/testInOutPairs.js';

const nonExamples = [];
for (const noExamples of [holyCExamples, processingExamples]) {
	ArrayUtils.pushAll(nonExamples, noExamples);
}

export function testIsLikelyAda(logger) {
	const cases = adaExamples.map(code => {
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
	testInOutPairs(cases, isLikelyAda, logger);
};