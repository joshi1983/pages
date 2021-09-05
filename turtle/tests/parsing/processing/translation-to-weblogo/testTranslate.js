import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { translate } from
'../../../../modules/parsing/processing/translation-to-weblogo/translate.js';

export function testTranslate(logger) {
	const cases = [
		{'in': '', 'out': ''},
		{'in': 'println(x.length)', 'out': 'print count :x'},
	];
	testInOutPairs(cases, translate, logger);
};