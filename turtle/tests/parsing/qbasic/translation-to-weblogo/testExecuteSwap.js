import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteSwap(logger) {
	const cases = [
	{'code': `let x = 3
let y = 5
print x, y
swap x, y
print x, y`,
	'messages': ['3\t5', '5\t3']},
	{'code': `dim a(1 to 2)
a(1) = 3
a(2) = 5
print a(1), a(2)
swap a(1), a(2)
print a(1), a(2)`,
	'messages': ['3\t5', '5\t3']},
	];
	processTranslateExecuteCases(cases, logger);
};