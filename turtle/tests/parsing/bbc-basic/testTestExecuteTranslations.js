import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testTestExecuteTranslations(logger) {
	const cases = [
		{'code': ' 30 REM VERSION 1 /16 NOV 81', 'messages': []},
		{'code': 'VDU 29,640;512', 'messages': []},
		{'code': 'mode 4', 'messages': []},
		{'code': 'print 1', 'messages': ['1']},
		{'code': 'print pi', 'messages': ['3.141593']},
		{'code': ` 80 FOR A=0 TO 3 STEP 1
	PRINT A
 NEXT A`, 'messages': ['0', '1', '2', '3']},
		{'code': `DEF PROC_emptyproc()
ENDPROC`, 'messages': []}
	];
	processTranslateExecuteCases(cases, logger);
};