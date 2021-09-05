import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translateQBASICToWebLogo } from
'../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';

export function testTranslateQBASICToWebLogo(logger) {
	const cases = [
		{'in': '', 'out': ''},
		{'in': 'print', 'out': 'print \'\''},
		{'in': 'print "hi"', 'out': 'print "hi'},
		{'in': 'print "hello world"', 'out': 'print \'hello world\''},
		{'in': 'print 4', 'out': 'print 4'},
		{'in': 'print true', 'out': 'print true'},
		{'in': 'print false', 'out': 'print false'},
		{'in': 'cls', 'out': 'clearScreen'},
		{'in': 'cls 1', 'out': 'clearScreen'},
		{'in': 'color x', 'out': 'setPenColor :x'},
		{'in': 'color x, y', 'out': 'setPenColor :x\nsetFillColor :y'},
		{'in': 'screen 4', 'out': ''},
		{'in': 'SLEEP 1', 'out': ''},
		{'in': 'end', 'out': ''},
		{'in': 'print "hello";x', 'out': 'print word "hello str :x'},
		{'in': 'SCREEN _NEWIMAGE(1000, 600, 256)', 'out': ''},
		{'in': '_SCREENMOVE _MIDDLE', 'out': ''},
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
		{'in': '_FULLSCREEN', 'out': ''},
		{'in': `TYPE Ant
x AS INTEGER
END TYPE`, 'out': ''},
		{'in': `DIM z(2)
print z(i)`, 'out': `make "z [ ]
print item 1 + :i :z`},
		{'in': `DIM z(2)
DIM z(1)
print z(i)`, 'out': `make "z [ ]
print item 1 + :i :z`}, // weird to declare z twice but we want to be sure no exception is thrown anyway.
		{'in': 'print &H01', 'out': 'print 1'},
		{'in': 'print &H0F', 'out': 'print 15'},
		{'in': 'print &H10', 'out': 'print 16'},
		{'in': 'print &HFF', 'out': 'print 255'},
		{'in': 'print &O01', 'out': 'print 1'},
		{'in': 'print &O10', 'out': 'print 8'},
		{'in': 'DEFINT x', 'out': ''},
		{'in': 'DEFLNG x', 'out': ''},
		{'in': 'DEFSNG x', 'out': ''},
		{'in': 'DEFDBL x', 'out': ''},
		{'in': 'DEFSTR x', 'out': ''},
		{'in': 'BSAVE filename$, VARPTR(Array(LB%)), filesize&', 'out': ''},
		{'in': '_palettecolor(1, 2, 3)', 'out': ''},
		{'in': 'line -(1,2)', 'outContains': 'setPos [ 1 2 ]'},
		{'in': 'print true', 'out': 'print true'},
		{'in': 'print false', 'out': 'print false'},
		{'in': 'ON ERROR GOTO ErrorRoutine', 'out': ''},

		{'in': 'print RND(1)', 'out': 'print randomRatio'},
		{'in': 'print RND(-1)', 'out': 'print randomRatio'},
		// RND(-1) works differently in QBasic but randomRatio is a sufficient
		// translation for now.
	];
	testInOutPairs(cases, translateQBASICToWebLogo, logger);
};