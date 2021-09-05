import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { translate } from
'../../../../modules/parsing/processing/translation-to-weblogo/translate.js';

export function testTranslateUnaryOperators(logger) {
	const cases = [
		{'in': `println(!true)`, 'out': 'print not true'},
		{'in': `println(~x)`, 'out': 'print bitNot :x'},
		// The ~ is not supported in Java and not likely in Processing but we want
		// want to support it anyway in case Processing eventually supports it.

		{'in': `println(-x)`, 'out': 'print -:x'},
	];
	testInOutPairs(cases, translate, logger);
};