import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecute(logger) {
	const cases = [
		{'code': '', 'messages': []},
		{'code': 'REM some comment', 'messages': []},
		{'code': '! some comment', 'messages': []},
		{'code': '50    PRINT', 'messages': ['']},
		{'code': 'print "hi"', 'messages': ['hi']},
		{'code': 'print lgt(10)', 'messages': ['1']},
		{'code': 'print ABS(-3)', 'messages': ['3']},
		{'code': 'print ABS(3)', 'messages': ['3']},
		{'code': 'print LEN("hi")', 'messages': ['2']},
		{'code': 'print SGN(-5)', 'messages': ['-1']},
		{'code': 'print SGN(5)', 'messages': ['1']},
		{'code': 'print SGN(0)', 'messages': ['0']},
		{'code': `x = 0
repeat
	x = x + 1
	print x
until x > 1`, 'messages': ['1', '2']},
		{'code': `x = 0
while x < 2
	x = x + 1
	print x
end while`, 'messages': ['1', '2']}
	];
	processTranslateExecuteCases(cases, logger);
};