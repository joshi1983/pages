import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteTranslations(logger) {
	const cases = [
		{'code': ' 30 REM VERSION 1 /16 NOV 81', 'messages': []},
		{'code': 'VDU 29,640;512', 'messages': []},
		{'code': 'mode 4', 'messages': []},
		{
			'code': 'PRINT',
			'messages': ['']
		},
		{
			'code': 'PRINT false',
			'messages': ['false']
		},
		{
			'code': 'PRINT true',
			'messages': ['true']
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
		{'code': 'print pi', 'messages': ['3.141593']},
		{'code': 'print SQR(64)', 'messages': ['8']},
		{'code': 'print SQR(100)', 'messages': ['10']},
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
	];
	processTranslateExecuteCases(cases, logger);
};