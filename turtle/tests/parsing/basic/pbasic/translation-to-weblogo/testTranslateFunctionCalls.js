import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translatePBasicToWebLogo } from
'../../../../../modules/parsing/basic/pbasic/translation-to-weblogo/translatePBasicToWebLogo.js';

export function testTranslateFunctionCalls(logger) {
	const cases = [
		{'in': 'buffer', 'out': ''},
		{'in': 'buffer:', 'out': ''},
		{'in': 'buffer:1', 'out': ''},
		{'in': 'timeroff', 'out': ''},
		{'in': 'timeron', 'out': ''},
		{'in': 'print "hi"', 'out': 'print "hi'},
		{'in': 'cls', 'out': 'clearScreen'},
		{'in': 'clr', 'out': 'clearScreen'},
		{'in': 'pen 3.0', 'out': 'setPenSize 3.0'},
		{'in': 'print sin(x)', 'out': 'print radSin :x'},
		{'in': 'print cos(x)', 'out': 'print radCos :x'},
		{'in': 'print tan(x)', 'out': 'print radTan :x'},
		{'in': 'print log(x)', 'out': 'print ln :x'},
		{'in': 'print log10(x)', 'out': 'print log10 :x'},
		{'in': 'print pi', 'out': 'print pi'},
	];
	testInOutPairs(cases, translatePBasicToWebLogo, logger);
};