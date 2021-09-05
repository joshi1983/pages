import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
import { translate } from '../../../../modules/parsing/pov-ray/translation-to-weblogo/translate.js';

export function testTranslate(logger) {
	const cases = [
		{'in': '', 'out': ''},
		{'in': '// hello world comment', 'out': '; hello world comment'},
		{'in': '/* hello world comment */', 'out': '; hello world comment'},
		{'in': '/* hello\nworld comment */', 'out': '; hello\n;world comment'},
		{'in': '"hi"', 'out': '"hi'},
		{'in': '"hi world"', 'out': '\'hi world\''},
		{'in': '#include "hi.pov"', 'out': ''},
		{'in': '#while (1) #end', 'out': 'while 1 [\n]'},
		{'in': '#if (1) #end', 'out': 'if 1 [\n]'},
		{'in': '#if (1) #else #end', 'out': 'ifElse 1 [\n] [\n]'},
		{'in': '#declare x 4', 'out': 'make "x 4'},
		{'in': '#declare x=4', 'out': 'make "x 4'},
		{'in': '#local x=4', 'out': 'make "x 4'},
		{'in': '#debug str(4)', 'out': 'print str 4'},
		{'in': '#debug str(1+4)', 'out': 'print str 1 + 4'},
		{'in': '#debug str(2*4)', 'out': 'print str 2 * 4'},
	];
	testInOutPairs(cases, translate, logger);
};