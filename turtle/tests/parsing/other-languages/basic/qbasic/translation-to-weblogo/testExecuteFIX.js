import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteFIX(logger) {
	const cases = [
		{'code': 'print FIX(2.5)', 'messages': ['2']},
		{'code': 'print FIX(-2.5)', 'messages': ['-2']},
		{'code': 'print FIX(0)', 'messages': ['0']},
		{'code': 'print FIX(0.1)', 'messages': ['0']},
		{'code': 'print FIX(0.5)', 'messages': ['0']},
		{'code': 'print FIX(0.7)', 'messages': ['0']},

		{'code': 'print FIX(1)', 'messages': ['1']},
		{'code': 'print FIX(1.1)', 'messages': ['1']},
		{'code': 'print FIX(1.5)', 'messages': ['1']},
		{'code': 'print FIX(1.7)', 'messages': ['1']},

		{'code': 'print FIX(-0.1)', 'messages': ['0']},
		{'code': 'print FIX(-0.5)', 'messages': ['0']},
		{'code': 'print FIX(-0.7)', 'messages': ['0']},

		{'code': 'print FIX(-1)', 'messages': ['-1']},
		{'code': 'print FIX(-1.1)', 'messages': ['-1']},
		{'code': 'print FIX(-1.5)', 'messages': ['-1']},
		{'code': 'print FIX(-1.7)', 'messages': ['-1']},
		{'code': 'print FIX(-2)', 'messages': ['-2']},
	];
	processTranslateExecuteCases(cases, logger);
};