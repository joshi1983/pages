import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteIf(logger) {
	const cases = [
		{'code': 'int x = 0; if (x < 2',
			'messages': []},
		{'code': 'int x = 0; if (x < 2) { println(x); }',
			'messages': ['0']},
		{'code': 'int x = 5; if (x > 2) { println(x); x--; } println(x);',
			'messages': ['5', '4']},
		{'code': 'int x = 5; if (x < 2) { println(x); x--; } println(x);',
			'analyzeCodeQuality': false,
			'messages': ['5']},
		{'code': 'int x = 5; if (x < 2) { println(x); x--; } else { println("else-part"); } println(x);',
			'analyzeCodeQuality': false,
			'messages': ['else-part', '5']},
		{'code': 'int x = 5; if (x < 2) { println(x); x--; } else if (x==5) { println("5-part"); } println(x);',
			'analyzeCodeQuality': false,
			'messages': ['5-part', '5']},
		{'code': 'int x = 5; if (x < 2) { println(x); x--; } else if (x==4) { println("4-part"); } else { println("else-part"); } println(x);',
			'analyzeCodeQuality': false,
			'messages': ['else-part', '5']},
	];
	processTranslateExecuteCases(cases, logger);
};