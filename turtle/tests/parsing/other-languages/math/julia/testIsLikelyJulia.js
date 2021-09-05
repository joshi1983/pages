import { ArrayUtils } from
'../../../../../modules/ArrayUtils.js';
import { batchExamples } from
'../../../../helpers/parsing/batchExamples.js';
import { isLikelyJulia } from
'../../../../../modules/parsing/other-languages/math/julia/isLikelyJulia.js';
import { juliaExamples } from
'../../../../helpers/parsing/math/juliaExamples.js';
import { matLabExamples } from
'../../../../helpers/parsing/math/matLabExamples.js';
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

const nonExamples = ArrayUtils.combine(batchExamples, matLabExamples,
povRayExamples, processingExamples, qbasicExamples, turingExamples);

export function testIsLikelyJulia(logger) {
	const cases = [];
	juliaExamples.forEach(function(code) {
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
	testInOutPairs(cases, isLikelyJulia, logger);
};