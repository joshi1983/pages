import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testTestExecuteTranslations(logger) {
	const cases = [
		{'code': ' 30 REM VERSION 1 /16 NOV 81', 'messages': []},
		{'code': 'VDU 29,640;512', 'messages': []},
		{'code': 'mode 4', 'messages': []},
		{
			'code': 'PRINT',
			'messages': ['']
		},
		{
			'code': 'PRINT CHR$(65)',
			'messages': ['A']
		},
		{
			'code': 'PRINT ASC("A")',
			'messages': ['65']
		},
		{'code': 'print 1', 'messages': ['1']},
		// some number base and number format test cases from
		// http://www.riscos.com/support/developers/bbcbasic/part2/outputting.html
		{'code': 'print 10', 'messages': ['10']},
		{'code': 'print &10', 'messages': ['16']},
		{'code': 'print ~10', 'messages': ['A']},

		{'code': 'print pi', 'messages': ['3.141593']},
		{'code': 'print 2^3', 'messages': ['8']},
		{'code': 'PRINT 4^0.5', 'messages': ['2']},
		{'code': 'print 2+3', 'messages': ['5']},
		{'code': 'print 2-3', 'messages': ['-1']},
		{'code': 'print 2 - 3', 'messages': ['-1']},
		{'code': 'print 2*3', 'messages': ['6']},
		{'code': 'print 4 div 2', 'messages': ['2']},
		{'code': 'print 5 div 2', 'messages': ['2']},
		{'code': 'print 4 / 2', 'messages': ['2']},
		{'code': 'print 4 <> 2', 'messages': ['true']},
		{'code': 'print 2 <> 2', 'messages': ['false']},
		{'code': 'print 4 = 2', 'messages': ['false']},
		{'code': 'print 1 = 1', 'messages': ['true']},
		{'code': 'print 4 < 2', 'messages': ['false']},
		{'code': 'print 2 < 2', 'messages': ['false']},
		{'code': 'print 1 < 2', 'messages': ['true']},
		{'code': 'print 4 <= 2', 'messages': ['false']},
		{'code': 'print 2 <= 2', 'messages': ['true']},
		{'code': 'print 1 >= 2', 'messages': ['false']},
		{'code': 'print 4 >= 2', 'messages': ['true']},
		{'code': 'print 2 >= 2', 'messages': ['true']},
		{'code': 'print SQR(64)', 'messages': ['8']},
		{'code': 'print SQR(100)', 'messages': ['10']},
		{
		'code': 'IF 5-6 THEN PRINT "TRUE"',
		'messages': ['TRUE']
		// page 101 of a book called 
		// BBC Microcomputer System User's Guide
		// says -1 is interpreted as true so that code should print 'TRUE'.
		// https://archive.org/details/bbc-user-guide/page/100/mode/2up?view=theater
		},
		// the following cases with math expressions should help find potential bugs involving
		// order of operation and operator precedence.
		{
			'code': 'PRINT 3 + 5 * 2',
			'messages': ['13']
			// copied from example at:
			// https://archive.org/details/bbcbasic0000coat/page/140/mode/2up?view=theater
			// That's page 140 of a book called 
			//  BBC Microcomputer -- Programming, BASIC (Computer program language)
			// published in 1983
		},
		{
			'code': 'PRINT (3+5)*2',
			'messages': ['16']
			// copied from example at:
			// https://archive.org/details/bbcbasic0000coat/page/140/mode/2up?view=theater
			// That's page 140 of a book called 
			//  BBC Microcomputer -- Programming, BASIC (Computer program language)
			// published in 1983
		},
		{
			'code': 'PRINT 8+20/2',
			'messages': ['18']
		},
		{
			'code': 'PRINT 9-4+2',
			'messages': ['7']
		},
		{
			'code': 'PRINT 12345/100',
			'messages': ['123.45']
			// case copied from https://archive.org/details/bbcbasic0000coat/page/142/mode/2up?view=theater
			// That's page 143 of a book.
			//  BBC Microcomputer -- Programming, BASIC (Computer program language)
			// published in 1983
		},
		{'code': ` 80 FOR A=0 TO 3 STEP 1
	PRINT A
 NEXT A`, 'messages': ['0', '1', '2', '3']},
		{'code': ` 80 FOR A=0 TO 7 STEP 2
	PRINT A
NEXT A`, 'messages': ['0', '2', '4', '6']},
		{'code': `DEF PROC_emptyproc()
ENDPROC`, 'messages': []},
		{'code': `x=0
repeat
	x = x + 1
	PRINT x
until x>2`, 'messages': ['1', '2', '3']},
		{'code': `A = 2
WHILE A > 0
	A = A - 1
	PRINT "A=";A
ENDWHILE
print "done"`, 'messages': ['A=1', 'A=0', 'done']},
	{'code': `A=1
A+=2
PRINT A`, 'messages': ['3']},
	{'code': `A=3
A*=2
PRINT A`, 'messages': ['6']},
	{'code': `A=3
A/=2
PRINT A`, 'messages': ['1.5']},
	{'code': `A=3
A-=2
PRINT A`, 'messages': ['1']},
	{'code': `A=3
A mod=2
PRINT A`, 'messages': ['1']},
	{'code': `A=4
A mod=2
PRINT A`, 'messages': ['0']},
	{'code': `A=4
A Mod=2
PRINT A`, 'messages': ['0']},
	{'code': `A=4
A div=2
PRINT A`, 'messages': ['2']},
	{'code': `A=4
A DIV=2
PRINT A`, 'messages': ['2']},
	{'code': `F=3
F=-F
PRINT F`, 'messages': ['-3']},
	{'code': `Z=1
IF true THEN 350
PRINT "hello"
350 PRINT "AFTER"`,
 'messages': ['AFTER']
 },
 {
'code': `IF 1 < 2 THEN
	PRINT "HI"`, 'messages': ['HI']
},
{
'code': `IF 1 > 2 THEN
	PRINT "HI"`, 'messages': []
},
	];
	processTranslateExecuteCases(cases, logger);
};