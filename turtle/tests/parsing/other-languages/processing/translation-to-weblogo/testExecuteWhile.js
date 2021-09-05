import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteWhile(logger) {
	const cases = [
		{'code': 'x = 0; while (x < 2) { println(x); x = x+1; }',
			'messages': ['0', '1']},
		{'code': 'int x = 5; while (x > 2) { println(x); x--; }',
			'messages': ['5', '4', '3']},
		{'code': 'int x = 5; while (x >= 2) { println(x); x--; }',
			'messages': ['5', '4', '3', '2']},
	];
	processTranslateExecuteCases(cases, logger);
};