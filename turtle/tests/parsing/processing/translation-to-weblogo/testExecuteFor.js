import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteFor(logger) {
	const cases = [
		{'code': 'for (int x = 1; x == 1; x++) { println(x); }',
			'messages': ['1']},
		{'code': 'for (int x = 1; x < 3; x++) { println(x); }',
			'messages': ['1', '2']},
		{'code': 'for (int x = 0; x < 3; x++) { println(x); }',
			'messages': ['0', '1', '2']},
		{'code': 'for (int x = 0; x <= 3; x++) { println(x); }',
			'messages': ['0', '1', '2', '3']},
		{'code': 'for (int x = 1; x <= 3; x++) { println(x); }',
			'messages': ['1', '2', '3']},
		{'code': 'for (int x = 1; x <= 3; x++) { println(x); } println(100 + x)',
			'messages': ['1', '2', '3', '104']},
	];
	processTranslateExecuteCases(cases, logger);
};