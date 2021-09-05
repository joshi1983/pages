import { adaExamples } from
'../../../helpers/parsing/adaExamples.js';
import { ArrayUtils } from
'../../../../modules/ArrayUtils.js';
import { holyCExamples } from
'../../../helpers/parsing/holyCExamples.js';
import { isLikelyAda } from
'../../../../modules/parsing/other-languages/ada/isLikelyAda.js';
import { processingExamples } from
'../../../helpers/parsing/processingExamples.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

const nonExamples = ArrayUtils.combine(holyCExamples, processingExamples);

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