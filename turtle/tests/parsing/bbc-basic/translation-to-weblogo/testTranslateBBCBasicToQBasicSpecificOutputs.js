import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { translateBBCBasicToQBasic } from
'../../../../modules/parsing/bbc-basic/translation-to-weblogo/translateBBCBasicToQBasic.js';

export function testTranslateBBCBasicToQBasicSpecificOutputs(logger) {
	const cases = [
		{'in': '', 'out': ''},
		{'in': 'REM comment', 'out': 'REM comment '},
		{'in': 'REM comment1\nREM comment2', 'out': 'REM comment1 \nREM comment2 '},
		{'in': `A=1
A+=2
PRINT A`, 'out': `A = 1 
A = A + 2 
print A `},
		{'in': 'left% = 100', 'out': 'left% = 100 '},
		{'in': 'move 10,20', 'out': 'move 10 , 20 '},
		{'in': 'line 1,2,3,4', 'out': 'line ( 1 , 2 ) - ( 3 , 4 ) '},
		{'in': 'dim x(5)', 'out': 'dim x ( 5 ) '},
		{'in': 'let x=5', 'out': 'let x = 5 '},
		{'in': 'DRAW 200,200', 'out': 'line - ( 200 , 200 ) '},
		{'in': 'if true then 100\n100',
		'out': `if true then goto 100 
100 `},
		{'in': 'print 10', 'out': 'print 10 '},
		{'in': 'print &10', 'out': 'print &H10 '},
		{'in': 'print ~&10', 'out': 'print "10" '},
		{'in': 'print ~10', 'out': 'print hex$ 10 '},
		{'in': `DEF PROC_p(i)
IF i=0 ENDPROC
print "hi"
ENDPROC`, 'outContains': 'if i = 0'},
		{'in': `DEF PROC_D()
DRAW x,y
IF x=0 ENDPROC
print x
ENDPROC`,
		'outContains': 'if x = 0'},
		{'in': `A=false
A OR= true
PRINT A`, 'out': `A = false 
A = A or true 
print A `}
	];
	testInOutPairs(cases, translateBBCBasicToQBasic, logger);
};