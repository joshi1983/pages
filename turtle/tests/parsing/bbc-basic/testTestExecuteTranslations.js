import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testTestExecuteTranslations(logger) {
	const cases = [
		{'code': ' 30 REM VERSION 1 /16 NOV 81', 'messages': []},
		{'code': 'VDU 29,640;512', 'messages': []},
		{'code': 'mode 4', 'messages': []},
		{'code': 'print 1', 'messages': ['1']},
		{'code': 'print pi', 'messages': ['3.141593']},
		{'code': 'print 2^3', 'messages': ['8']},
		{'code': 'print 2+3', 'messages': ['5']},
		{'code': 'print 2-3', 'messages': ['-1']},
		{'code': 'print 2*3', 'messages': ['6']},
		{'code': 'print 4 div 2', 'messages': ['2']},
		{'code': 'print 5 div 2', 'messages': ['2']},
		{'code': 'print 4 / 2', 'messages': ['2']},
		{'code': 'print 4 <> 2', 'messages': ['true']},
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
		{'code': ` 80 FOR A=0 TO 3 STEP 1
	PRINT A
 NEXT A`, 'messages': ['0', '1', '2', '3']},
		{'code': ` 80 FOR A=0 TO 7 STEP 2
	PRINT A
NEXT A`, 'messages': ['0', '2', '4', '6']},
		{'code': `DEF PROC_emptyproc()
ENDPROC`, 'messages': []},
		/*{'code': `x=0
repeat
	x = x + 1
	PRINT x
until x>2`, 'messages': ['1', '2', '3']}*/
	];
	processTranslateExecuteCases(cases, logger);
};