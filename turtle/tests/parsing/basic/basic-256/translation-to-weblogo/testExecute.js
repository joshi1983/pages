import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecute(logger) {
	const cases = [
		{'code': '', 'messages': []},
		{'code': 'print "hi"', 'messages': ['hi']},
		{'code': `x = 0
while x < 2
	print x
	x = x + 1
end while`, 'messages': ['0', '1']},
		{'code': `for i = 1 to 2
	print i
next i`, 'messages': ['1', '2']},
		{'code': `for i = 1 to 6 step 2
	print i
next i`, 'messages': ['1', '3', '5']},
		{'code': `for i = 3 to 1 step -1
	print i
next i`, 'messages': ['3', '2', '1']},
		{'code': 'print right("Hello", 2)',
		'messages': ['lo']},
		{'code': 'print right("Hello", -2)',
		'messages': ['Hel']}
	];
	processTranslateExecuteCases(cases, logger);
};