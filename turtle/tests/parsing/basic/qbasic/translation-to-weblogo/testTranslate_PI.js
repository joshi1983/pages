import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translate } from
'../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/translate.js';

export function testTranslate_PI(logger) {
	const cases = [
		{'in': 'print _PI', 'out': 'print pi'},
		{'in': 'print _PI / 2', 'out': 'print pi / 2'},
		{'in': 'print _PI = 0', 'out': 'print pi = 0'},
		{'in': 'print _PI * 2', 'out': 'print pi * 2'},
		{'in': 'print _PI + 2', 'out': 'print pi + 2'},
		{'in': 'print _PI - 2', 'out': 'print pi - 2'}
	];
	testInOutPairs(cases, translate, logger);
};