import { translateAppleSoftBasicToQBasic } from
'../../../../../modules/parsing/basic/applesoft-basic/translation-to-weblogo/translateAppleSoftBasicToQBasic.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

export function testTranslateAppleSoftBasicToQBasic(logger) {
	const cases = [
		{'in': '', 'out': ''},
		{'in': 'hgr', 'out': ''},
		{'in': 'color = 3', 'out': 'color 3 '},
		{'in': 'color = 5', 'out': 'color 5 '},
		{'in': 'color = x', 'out': 'color x '},
		{'in': 'let color = 3', 'out': 'color 3 '},
		{'in': '] run', 'out': ''},
		{'in': 'print "hi"', 'out': 'print "hi" '},
		{'in': 'hplot 2,3', 'out': 'pset 2 , 3 '},
		{'in': 'hplot 2,3 TO 4,5', 'out': 'line ( 2 , 3 ) - ( 4 , 5 ) '},
	];
	testInOutPairs(cases, translateAppleSoftBasicToQBasic, logger);
};