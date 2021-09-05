import { ArrayUtils } from
'../../../../modules/ArrayUtils.js';
import { cExamples } from
'../../../helpers/parsing/cExamples.js';
import { cppExamples } from
'../../../helpers/parsing/cppExamples.js';
import { glslExamples } from
'../../../helpers/parsing/shaders/glslExamples.js';
import { holyCExamples } from
'../../../helpers/parsing/holyCExamples.js';
import { isLikelyCPP } from
'../../../../modules/parsing/other-languages/c++/isLikelyCPP.js';
import { logoInterpreterExamples } from
'../../../helpers/parsing/logoInterpreterExamples.js';
import { pitrifiedGoTurtleExamples } from '../../../helpers/parsing/pitrifiedGoTurtleExamples.js';
import { processingExamples } from '../../../helpers/parsing/processingExamples.js';
import { terrapinExamples } from
'../../../helpers/parsing/terrapinExamples.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

const nonExamples = ArrayUtils.combine(cExamples, glslExamples, holyCExamples, logoInterpreterExamples,
pitrifiedGoTurtleExamples, terrapinExamples).concat(processingExamples);

export function testIsLikelyCPP(logger) {
	const cases = [];
	cppExamples.forEach(function(code) {
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
	testInOutPairs(cases, isLikelyCPP, logger);
};