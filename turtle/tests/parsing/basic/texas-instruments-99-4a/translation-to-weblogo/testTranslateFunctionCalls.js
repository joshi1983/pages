import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translateTI99BasicToWebLogo } from
'../../../../../modules/parsing/basic/texas-instruments-99-4a/translation-to-weblogo/translateTI99BasicToWebLogo.js';

export function testTranslateFunctionCalls(logger) {
	const cases = [
		{'in': '10 CALL PRINT "hi"', 'out': 'print "hi'},
		{'in': '10 CALL PRINT "hi"\ngoto 10', 'out': 'forever [\n\tprint "hi\n]'},
		{'in': 'NEW', 'out': ''},
		{'in': 'RUN', 'out': ''},
		{'in': 'LIST', 'out': ''},
		{'in': '110 ON A GOTO 120, 140\n120\n140', 'out': ''},
		{'in': '10 CALL SCREEN(2)', 'out': 'setScreenColor 2'}
	];
	testInOutPairs(cases, translateTI99BasicToWebLogo, logger);
};