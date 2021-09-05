import { insertSpaces } from
'../../../../../modules/parsing/basic/bbc-basic/translation-to-weblogo/insertSpaces.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

export function testInsertSpaces(logger) {
	const cases = [
		{'in': 'DEFPROC_', 'out': 'DEF PROC_'},
		{'in': 'defproc_', 'out': 'def proc_'},
		{'in': 'DEFPROC_p', 'out': 'DEF PROC_p'},
		{'in': '12 DEFPROC_', 'out': '12 DEF PROC_'},
		{'in': '12:DEFPROC_', 'out': '12:DEF PROC_'},
		{'in': 'print "', 'out': 'print "'},
		{'in': 'print"', 'out': 'print "'},
		{'in': '12 print"', 'out': '12 print "'},
		{'in': '12:print"', 'out': '12:print "'},
		{'in': 'mode 0', 'out': 'mode 0'},
		{'in': 'mode0', 'out': 'mode 0'},
	];
	testInOutPairs(cases, insertSpaces, logger);
};