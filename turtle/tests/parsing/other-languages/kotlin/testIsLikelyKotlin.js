import { ArrayUtils } from
'../../../../modules/ArrayUtils.js';
import { kojoExamples } from
'../../../helpers/parsing/kojoExamples.js';
import { kotlinExamples } from
'../../../helpers/parsing/kotlinExamples.js';
import { isLikelyKotlin } from
'../../../../modules/parsing/other-languages/kotlin/isLikelyKotlin.js';
import { processingExamples } from
'../../../helpers/parsing/processingExamples.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

const nonExamples = ArrayUtils.combine(kojoExamples, processingExamples);

export function testIsLikelyKotlin(logger) {
	const cases = [];
	kotlinExamples.forEach(function(code) {
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
	testInOutPairs(cases, isLikelyKotlin, logger);
};