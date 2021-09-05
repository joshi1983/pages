import { ArrayUtils } from
'../../../../../modules/ArrayUtils.js';
import { gleamExamples } from
'../../../../helpers/parsing/gleamExamples.js';
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
import { isLikelyWGSL } from
'../../../../../modules/parsing/other-languages/shaders/wgsl/isLikelyWGSL.js';
import { processingExamples } from
'../../../../helpers/parsing/processingExamples.js';
import { rustTurtleExamples } from
'../../../../helpers/parsing/rustTurtleExamples.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { wgslExamples } from
'../../../../helpers/parsing/shaders/wgslExamples.js';

const nonExamples = ArrayUtils.combine(gleamExamples,
glslExamples, hlslExamples, holyCExamples, kojoExamples,
kotlinExamples, processingExamples, rustTurtleExamples);

export function testIsLikelyWGSL(logger) {
	const cases = [];
	wgslExamples.forEach(function(code) {
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
	testInOutPairs(cases, isLikelyWGSL, logger);
};