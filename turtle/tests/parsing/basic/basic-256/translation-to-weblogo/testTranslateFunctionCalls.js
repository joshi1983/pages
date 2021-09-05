import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translateBasic256ToWebLogo } from
'../../../../../modules/parsing/basic/basic-256/translation-to-weblogo/translateBasic256ToWebLogo.js';

export function testTranslateFunctionCalls(logger) {
	const cases = [
		{'in': 'print "clear" + "2"', 'out': 'print word "clear "2'},
		{'in': 'penwidth 2', 'out': 'setPenSize 2'},
		{'in': 'color red', 'out': 'setPenColor "red'},
		{'in': 'color red, clear', 'out': 'setPenColor "red\nsetFillColor transparent'},
		{'in': 'clg red', 'out': 'setScreenColor "red'},
		{'in': 'color "red"', 'out': 'setPenColor "red'},
		{'in': 'clg "red"', 'out': 'setScreenColor "red'},
		{'in': 'print "red"', 'out': 'print "red'},
		{'in': 'print "clear"', 'out': 'print "clear'},
	];
	testInOutPairs(cases, translateBasic256ToWebLogo, logger);
};