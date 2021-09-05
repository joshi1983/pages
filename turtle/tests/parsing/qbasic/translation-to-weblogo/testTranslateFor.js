import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
import { translate } from
'../../../../modules/parsing/qbasic/translation-to-weblogo/translate.js';

export function testTranslateFor(logger) {
	const cases = [
	{'in': `for i = 1 to 10
	print "hi"
next i`,
	'out': `repeat 10 [
	print "hi
]`},{'in': `for i = 1 to 10
	print i
next i`,
	'out': `repeat 10 [
	print repcount
]`}];
	testInOutPairs(cases, translate, logger);
};