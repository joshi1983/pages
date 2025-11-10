import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { translate } from
'../../../../modules/parsing/processing/translation-to-weblogo/translate.js';

export function testTranslateFor(logger) {
	const cases = [
		{'in': 'for (int i = 0; i < 10; i++) {}',
		'out': 'repeat 10 [\n]'},
		{'in': 'for (int i = 0; i < 100; i++) {}',
		'out': 'repeat 100 [\n]'},
		{'in': 'for (int i = 0; i < limit; i++) {}',
		'out': 'repeat :limit [\n]'},
		{'in': 'for (int i = 1; i < 100; i++) {f(i);}',
		'out': 'repeat 100 [\n\tf\n\trepcount\n]'},
	];
	testInOutPairs(cases, translate, logger);
};