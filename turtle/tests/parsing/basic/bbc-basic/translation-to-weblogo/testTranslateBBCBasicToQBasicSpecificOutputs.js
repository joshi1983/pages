import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translateBBCBasicToQBasic } from
'../../../../../modules/parsing/basic/bbc-basic/translation-to-weblogo/translateBBCBasicToQBasic.js';

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
print A `},
		{'in': 'MODE MODE', 'out': 'cls '
		// the example triangle.txt commented that 'MODE MODE' would clear the screen.
		// CLS in QBASIC will clear the screen.
		// CLS in QBASIC will also get translated to clearScreen in WebLogo.
		},
		{
			'in': 'ON phase% PROCsetup , PROCsimulation ELSE',
			'out': 'ON phase% PROCsetup , PROCsimulation '
			// QBASIC doesn't support ELSE in ON statements so 
			// the ELSE should be removed to make the code more like QBASIC.
			// Darren Northcott explained the ELSE in this line:
			// "It's a catchall for values of the test variable outside of the 
			// number of entries, so in this instance any value of phase above 2 is ignored"
			// which can be found at:
			// https://www.facebook.com/groups/2057165187928233/posts/3840544786256922/?comment_id=4015512355426830&reply_comment_id=4016971258614273&notif_id=1753182773564746&notif_t=group_comment_mention
		},
		{
			'in': 'ON phase% PROCsetup , PROCsimulation ELSE REM some comment',
			'out': 'ON phase% PROCsetup , PROCsimulation REM some comment '
		}
	];
	testInOutPairs(cases, translateBBCBasicToQBasic, logger);
};