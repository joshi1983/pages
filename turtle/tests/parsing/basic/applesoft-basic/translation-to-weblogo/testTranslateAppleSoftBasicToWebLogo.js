import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translateAppleSoftBasicToWebLogo } from
'../../../../../modules/parsing/basic/applesoft-basic/translation-to-weblogo/translateAppleSoftBasicToWebLogo.js';

export function testTranslateAppleSoftBasicToWebLogo(logger) {
	const cases = [
		{'in': '', 'out': ''},
		{'in': 'REM some comment', 'out': '; some comment'},
		{'in': 'hgr', 'out': ''},
		{'in': 'list', 'out': ''},
		{'in': 'LIST 11-12', 'out': ''},
		{'in': 'end', 'out': ''},
		{'in': 'a=3', 'out': 'make "a 3'},
		{'in': 'let a=3', 'out': 'make "a 3'},
		{'in': 'print "hi"', 'out': 'print "hi'},
		{'in': 'print abs(a)', 'out': 'print abs :a'},
		{'in': 'print asc(a)', 'out': 'print ascii :a'},
		{'in': 'print atn(a)', 'out': 'print radArcTan :a'},
		{'in': 'print chr$(a)', 'out': 'print char :a'},
		{'in': 'print cos(a)', 'out': 'print radCos :a'},
		{'in': 'print exp(a)', 'out': 'print exp :a'},
		{'in': 'print len(a)', 'out': 'print count :a'},
		{'in': 'print log(a)', 'out': 'print ln :a'},
		{'in': 'print sgn(a)', 'out': 'print sign :a'},
		{'in': 'print sin(a)', 'out': 'print radSin :a'},
		{'in': 'print sqr(a)', 'out': 'print sqrt :a'},
		{'in': 'print str$(a)', 'out': 'print str :a'},
		{'in': 'print tan(a)', 'out': 'print radTan :a'},
		{'in': `FOR A = 1 TO 10
	PRINT A
NEXT A`, 'out': `repeat 10 [
	print repcount
]`},
		{'in': `FOR A = 0 TO 10
	PRINT A
NEXT A`, 'out': `for [ "A 0 10 ] [
	print :A
]`},
	];
	testInOutPairs(cases, translateAppleSoftBasicToWebLogo, logger);
};