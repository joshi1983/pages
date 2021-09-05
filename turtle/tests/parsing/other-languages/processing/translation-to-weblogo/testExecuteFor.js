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
		{'code': 'int x;for (x = 1; x <= 3; x++) { println(x); } println(100 + x)',
			'messages': ['1', '2', '3', '104'], 'analyzeCodeQuality': false},
		{'code': 'int stepValue=2;for (x = 1; x < 5; x+=stepValue) { println(x); }',
			'messages': ['1', '3']},
		{'code': 'int stepValue=2;for (x = 5; x > 0; x-=stepValue) { println(x); }',
			'messages': ['5', '3', '1']},
	];
	processTranslateExecuteCases(cases, logger);
};