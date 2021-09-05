import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
import { translate } from
'../../../../modules/parsing/qbasic/translation-to-weblogo/translate.js';

export function testTranslate(logger) {
	const cases = [
		{'in': '', 'out': ''},
		{'in': 'print "hi"', 'out': 'print "hi'},
		{'in': 'print "hello world"', 'out': 'print \'hello world\''},
		{'in': 'print 4', 'out': 'print 4'},
		{'in': 'cls', 'out': 'clearScreen'},
		{'in': 'screen 4', 'out': ''},
	];
	testInOutPairs(cases, translate, logger);
};