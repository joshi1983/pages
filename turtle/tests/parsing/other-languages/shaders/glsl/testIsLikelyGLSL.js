import { ArrayUtils } from
'../../../../../modules/ArrayUtils.js';
import { elmExamples } from
'../../../../helpers/parsing/elmExamples.js';
import { glslExamples } from
'../../../../helpers/parsing/shaders/glslExamples.js';
import { hlslExamples } from
'../../../../helpers/parsing/shaders/hlslExamples.js';
import { holyCExamples } from
'../../../../helpers/parsing/holyCExamples.js';
import { kojoExamples } from
'../../../../helpers/parsing/kojoExamples.js';
import { kotlinExamples } from
'../../../../helpers/parsing/kotlinExamples.js';
import { isLikelyGLSL } from
'../../../../../modules/parsing/other-languages/shaders/glsl/isLikelyGLSL.js';
import { processingExamples } from
'../../../../helpers/parsing/processingExamples.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

const nonExamples = ArrayUtils.combine(elmExamples, hlslExamples,
holyCExamples, kojoExamples,
kotlinExamples, processingExamples);

export function testIsLikelyGLSL(logger) {
	const cases = [];
	glslExamples.forEach(function(code) {
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
	testInOutPairs(cases, isLikelyGLSL, logger);
};