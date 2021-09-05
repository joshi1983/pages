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
		{'in': 'LET x = 3', 'out': 'make "x 3'},
		{'in': 'CONST x = 3', 'out': 'make "x 3'},
		{'in': 'print "hello";x', 'out': 'print word "hello str :x'},
		{'in': 'i% = 1', 'out': 'make "i 1'},
		{'in': 'SCREEN _NEWIMAGE(1000, 600, 256)', 'out': ''},
		{'in': '_SCREENMOVE _MIDDLE', 'out': ''},
		{'in': 'DIM a, b, result AS INTEGER', 'out': ''},
		{'in': 'DECLARE SUB SwapVal (a, b)', 'out': ''},
		// A DECLARE has no equivalent in WebLogo.
		// In QBasic, subroutines, functions, defs can be declared which 
		// is a bit like c's function prototypes.
		// Later, there will be a full implementation of the declared identifiers.
		// That later part is what will be translated to WebLogo.
		
		{'in': '$EXEICON:’iconfile.ico’', 'out': ''},
		// documented at: https://qb64.com/wiki/$EXEICON
		{'in': '$DEBUG', 'out': ''},
		{'in': '$CONSOLE ONLY', 'out': ''},
		{'in': 'WAIT &H3DA, 8', 'out': ''},
		{'in': 'PRINT a; "+"; b; "="; e', 'out': `print ( word str :a '+' str :b '=' str :e )`}
	];
	testInOutPairs(cases, translate, logger);
};