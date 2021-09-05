import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
import { translate } from
'../../../../modules/parsing/qbasic/translation-to-weblogo/translate.js';

export function testTranslate(logger) {
	const cases = [
		{'in': '', 'out': ''},
		{'in': 'print', 'out': 'print \'\''},
		{'in': 'print "hi"', 'out': 'print "hi'},
		{'in': 'print "hello world"', 'out': 'print \'hello world\''},
		{'in': 'print 4', 'out': 'print 4'},
		{'in': 'print 4+ -2', 'out': 'print 4 - 2'},
		{'in': 'cls', 'out': 'clearScreen'},
		{'in': 'screen 4', 'out': ''},
		{'in': 'end', 'out': ''},
		{'in': 'LET x = 3', 'out': 'make "x 3'},
		{'in': 'CONST x = 3', 'out': 'make "x 3'},
		{'in': 'print "hello";x', 'out': 'print word "hello str :x'},
		{'in': 'i% = 1', 'out': 'make "i 1'},
		{'in': 'SCREEN _NEWIMAGE(1000, 600, 256)', 'out': ''},
		{'in': '_SCREENMOVE _MIDDLE', 'out': ''},
		{'in': 'DIM a, b, result AS INTEGER', 'out': `make "a [ ]
make "b [ ]
make "result [ ]`},
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
		{'in': 'PRINT a; "+"; b; "="; e', 'out': `print ( word str :a '+' str :b '=' str :e )`},
		{'in': ' RANDOMIZE TIMER', 'out': '(\n\trerandom animation.time\n)'},
		{'in': 'x = 3\nx$ = "hi"', 'out': `make "x 3
make "x1 "hi`},
		{'in': '_FULLSCREEN', 'out': ''},
		{'in': `TYPE Ant
x AS INTEGER
END TYPE`, 'out': ''},
		{'in': 'z(i) = 1', 'out': 'setItem :i "z 1'},
		{'in': `DIM z
print z(i)`, 'out': `make "z [ ]
print item :i :z`},
		{'in': `DIM z
DIM z
print z(i)`, 'out': `make "z [ ]
print item :i :z`}, // weird to declare z twice but we want to be sure no exception is thrown anyway.
		{'in': 'p.x = 3', 'out': 'setProperty "p "x 3'},
		{'in': 'print p.x', 'out': 'print getProperty "p "x'},
		{'in': 'dim a\nprint a(1).x', 'out': 'make "a [ ]\nprint getProperty2 ( item 1 :a ) "x'},
		{'in': 'dim a\na(1).x = 5', 'out': 'make "a [ ]\nsetProperty2 ( item 1 :a ) "x 5'},,
		{'in': 'print &H01', 'out': 'print 1'},
		{'in': 'print &H0F', 'out': 'print 15'},
		{'in': 'print &HFF', 'out': 'print 255'},
	];
	testInOutPairs(cases, translate, logger);
};