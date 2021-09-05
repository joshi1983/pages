import { ArrayUtils } from
'../../../../modules/ArrayUtils.js';
import { batchExamples } from
'../../../helpers/parsing/batchExamples.js';
import { kojoExamples } from
'../../../helpers/parsing/kojoExamples.js';
import { kotlinExamples } from
'../../../helpers/parsing/kotlinExamples.js';
import { isLikelyPHP } from
'../../../../modules/parsing/other-languages/php/isLikelyPHP.js';
import { perlExamples } from
'../../../helpers/parsing/perlExamples.js';
import { phpExamples } from
'../../../helpers/parsing/phpExamples.js';
import { processingExamples } from
'../../../helpers/parsing/processingExamples.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

const nonExamples = ArrayUtils.combine(batchExamples, kojoExamples,
kotlinExamples, perlExamples, processingExamples);

export function testIsLikelyPHP(logger) {
	const cases = [];
	phpExamples.forEach(function(code) {
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
	testInOutPairs(cases, isLikelyPHP, logger);
};