import { ArrayUtils } from
'../../../../modules/ArrayUtils.js';
import { glslExamples } from
'../../../helpers/parsing/shaders/glslExamples.js';
import { holyCExamples } from
'../../../helpers/parsing/holyCExamples.js';
import { isLikelyHolyC } from
'../../../../modules/parsing/other-languages/holy-c/isLikelyHolyC.js';
import { logoInterpreterExamples } from
'../../../helpers/parsing/logoInterpreterExamples.js';
import { pitrifiedGoTurtleExamples } from '../../../helpers/parsing/pitrifiedGoTurtleExamples.js';
import { processingExamples } from '../../../helpers/parsing/processingExamples.js';
import { terrapinExamples } from
'../../../helpers/parsing/terrapinExamples.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

const nonExamples = ArrayUtils.combine(glslExamples, logoInterpreterExamples,
pitrifiedGoTurtleExamples, terrapinExamples).concat(processingExamples);

export function testIsLikelyHolyC(logger) {
	const cases = [
		{'in': `public class U8 {
	public static void main(String[] args) {
		U8 A;
		U8 B = new U8();
	}
}`, 'out': false
	// That is an example of Java.
	// Defining and using a type named U8 makes part of the code resemble HolyC code.
	}
	];
	holyCExamples.forEach(function(code) {
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
	testInOutPairs(cases, isLikelyHolyC, logger);
};