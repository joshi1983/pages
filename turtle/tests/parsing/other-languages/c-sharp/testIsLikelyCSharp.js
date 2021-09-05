import { ArrayUtils } from
'../../../../modules/ArrayUtils.js';
import { cExamples } from
'../../../helpers/parsing/cExamples.js';
import { cppExamples } from
'../../../helpers/parsing/cppExamples.js';
import { cSharpExamples } from
'../../../helpers/parsing/cSharpExamples.js';
import { glslExamples } from
'../../../helpers/parsing/shaders/glslExamples.js';
import { holyCExamples } from
'../../../helpers/parsing/holyCExamples.js';
import { isLikelyCSharp } from
'../../../../modules/parsing/other-languages/c-sharp/isLikelyCSharp.js';
import { logoInterpreterExamples } from
'../../../helpers/parsing/logoInterpreterExamples.js';
import { pitrifiedGoTurtleExamples } from '../../../helpers/parsing/pitrifiedGoTurtleExamples.js';
import { processingExamples } from '../../../helpers/parsing/processingExamples.js';
import { terrapinExamples } from
'../../../helpers/parsing/terrapinExamples.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { vbDotNetExamples } from
'../../../helpers/parsing/basic/vbDotNetExamples.js';

const nonExamples = ArrayUtils.combine(cExamples, cppExamples,
glslExamples, holyCExamples, logoInterpreterExamples,
pitrifiedGoTurtleExamples, processingExamples, terrapinExamples, vbDotNetExamples);

export function testIsLikelyCSharp(logger) {
	const cases = [];
	cSharpExamples.forEach(function(code) {
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
	testInOutPairs(cases, isLikelyCSharp, logger);
};