import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
import { translate } from '../../../../modules/parsing/kturtle/translation-to-weblogo/translate.js';

export function testTranslateWithComments(logger) {
	const cases = [
		{'in': '#', 'out': ';'},
		{'in': '# hello', 'out': '; hello'},
		{'in': '# hello\nrepeat 4 {}', 'out': '; hello\nrepeat 4 [\n]'},
		{'in': 'turnright 90 # hello', 'out': 'right 90\n; hello'},
		{'in': '#hello\nturnright 90', 'out': ';hello\nright 90'},
	];
	testInOutPairs(cases, translate, logger);
};