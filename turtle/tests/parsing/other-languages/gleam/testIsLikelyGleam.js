import { ArrayUtils } from
'../../../../modules/ArrayUtils.js';
import { batchExamples } from
'../../../helpers/parsing/batchExamples.js';
import { gleamExamples } from
'../../../helpers/parsing/gleamExamples.js';
import { kojoExamples } from
'../../../helpers/parsing/kojoExamples.js';
import { kotlinExamples } from
'../../../helpers/parsing/kotlinExamples.js';
import { isLikelyGleam } from
'../../../../modules/parsing/other-languages/gleam/isLikelyGleam.js';
import { phpExamples } from
'../../../helpers/parsing/phpExamples.js';
import { processingExamples } from
'../../../helpers/parsing/processingExamples.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

const nonExamples = ArrayUtils.combine(batchExamples, kojoExamples,
kotlinExamples, phpExamples, processingExamples);

export function testIsLikelyGleam(logger) {
	const cases = [];
	gleamExamples.forEach(function(code) {
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
	testInOutPairs(cases, isLikelyGleam, logger);
};