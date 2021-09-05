import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

/*
do while {condition} {instructions} loop
behaves the same as a while {condition} {instructions} wend
according to various tests run at https://qbjs.org/ and https://archive.org/details/msdos_qbasic_megapack.
*/
export function testExecuteDoWhileInstructionsLoop(logger) {
	const cases = [
		{'code': `do while false
	print "yo"
loop
print "hi"`, 'messages': ['hi'], 'analyzeCodeQuality': false},
		{'code': `i = 0
do while i < 2\n
	print i
	i = i + 1
loop
print "hi"`, 'messages': ['0', '1', 'hi']
},
		{'code': `i = 1
DO WHILE i < 0 
	PRINT i REM ========== never runs either. 
	i = i + 1 
LOOP`,
		'messages': []}
	];
	processTranslateExecuteCases(cases, logger);
};