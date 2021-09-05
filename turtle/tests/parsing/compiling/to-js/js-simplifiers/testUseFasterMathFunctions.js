import { processFixerTestCases } from
'../../../js-parsing/translation-to-weblogo/simplifying/processFixerTestCases.js';
import { useFasterMathFunctions } from
'../../../../../modules/parsing/compiling/to-js/js-simplifiers/useFasterMathFunctions.js';

export function testUseFasterMathFunctions(logger) {
	const cases = [
		{'code': 'Math.sqrt(2)', 'changed': false},
		{'code': 'Math.sqrt(x)', 'changed': false},
		{'code': 'Math.cbrt(2)', 'changed': false},
		{'code': 'Math.cbrt(x)', 'changed': false},
		{'code': 'Math.exp(x)', 'changed': false},
		{'code': 'Math.pow(x, 0.5)', 'to': 'Math.sqrt(x )'},
		{'code': 'Math.pow(x, 0.3333333333333)', 'to': 'Math.cbrt(x )'},
		{'code': 'Math.pow(x, 1/3)', 'to': 'Math.cbrt(x )'},
		{'code': 'Math.pow(2.718281828459045, p)', 'to': 'Math.exp(p )'},
		{'code': 'Math.pow(Math.E, p)', 'to': 'Math.exp(p )'},
	];
	processFixerTestCases(cases, useFasterMathFunctions, logger);
};