import { ArrayUtils } from
'../../../../modules/ArrayUtils.js';
import { cExamples } from
'../../../helpers/parsing/cExamples.js';
import { glslExamples } from
'../../../helpers/parsing/shaders/glslExamples.js';
import { holyCExamples } from
'../../../helpers/parsing/holyCExamples.js';
import { isLikelyC } from
'../../../../modules/parsing/other-languages/c/isLikelyC.js';
import { logoInterpreterExamples } from
'../../../helpers/parsing/logoInterpreterExamples.js';
import { pitrifiedGoTurtleExamples } from '../../../helpers/parsing/pitrifiedGoTurtleExamples.js';
import { processingExamples } from '../../../helpers/parsing/processingExamples.js';
import { terrapinExamples } from
'../../../helpers/parsing/terrapinExamples.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

const nonExamples = ArrayUtils.combine(glslExamples, holyCExamples, logoInterpreterExamples,
pitrifiedGoTurtleExamples, processingExamples, terrapinExamples);

export function testIsLikelyC(logger) {
	const cases = [];
	cExamples.forEach(function(code) {
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
	testInOutPairs(cases, isLikelyC, logger);
};