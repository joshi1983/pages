import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translateTI99BasicToWebLogo } from
'../../../../../modules/parsing/basic/texas-instruments-99-4a/translation-to-weblogo/translateTI99BasicToWebLogo.js';

export function testTranslateFunctionCalls(logger) {
	const cases = [
		{'in': '10 CALL PRINT "hi"', 'out': 'print "hi'},
		{'in': '10 CALL PRINT "hi"\ngoto 10', 'out': 'forever [\n\tprint "hi\n]'},
		{'in': '130 CALL SOUND(1000,F,2,F*2,5,F*4,9)', 'out': ''},
		{'in': '30 CALL SOUND(1000,-4,2,110,OFF,110,OFF,F,2)', 'out': ''},
		{'in': 'NEW', 'out': ''},
		{'in': 'RUN', 'out': ''},
		{'in': 'LIST', 'out': ''},
		{'in': '110 ON A GOTO 120, 140\n120\n140', 'out': ''},
		{'in': '10 CALL SCREEN(2)', 'out': 'setScreenColor 2'},
		{'in': '10 CALL HCHAR(1,2,3)', 'outContains': 'ti99_hchar_3 1 2 3'},
		{'in': '10 CALL HCHAR(1,2,3,4)', 'outContains': 'ti99_hchar_4 1 2 3 4'},
		{'in': '10 CALL VCHAR(1,2,3,4)', 'outContains': 'ti99_vchar_4 1 2 3 4'},
		{'in': '110 CALL KEY(0,x,s)', 'outContains': 'make "x 0\nmake "s 0'},
	];
	testInOutPairs(cases, translateTI99BasicToWebLogo, logger);
};