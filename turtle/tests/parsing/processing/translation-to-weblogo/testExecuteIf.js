import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteIf(logger) {
	const cases = [
		{'code': 'int x = 0; if (x < 2) { println(x); }',
			'messages': ['0']},
		{'code': 'int x = 5; if (x > 2) { println(x); x--; } println(x);',
			'messages': ['5', '4']},
	];
	processTranslateExecuteCases(cases, logger);
};