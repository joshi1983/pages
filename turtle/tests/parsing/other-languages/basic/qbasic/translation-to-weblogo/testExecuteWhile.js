import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteWhile(logger) {
	const cases = [
		{'code': `while false
	print "yo"
wend
print "hi"`, 'messages': ['hi'], 'analyzeCodeQuality': false},
		{'code': `i = 0
while i < 2\n
	print i
	i = i + 1
wend
print "hi"`, 'messages': ['0', '1', 'hi']
},
		{'code': `i = 1
WHILE i < 0 
	PRINT i REM ======== never runs. 
	i = i + 1 
WEND`, 'messages': []}
	];
	processTranslateExecuteCases(cases, logger);
};