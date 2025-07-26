import { processTranslateExecuteCases } from './processTranslateExecuteCases.js';

export function testExecuteOperators(logger) {
	const cases = [
		{'code': 'print 1+2', 'messages': ['3']},
		{'code': 'print(1+2)', 'messages': ['3']},
		{'code': 'print(1-3)', 'messages': ['-2']},
		{'code': 'print(2-3)', 'messages': ['-1']},
		{'code': 'print(1*2)', 'messages': ['2']},
		{'code': 'print(1**2)', 'messages': ['1']},
		{'code': 'print(2**3)', 'messages': ['8']},
		{'code': 'print(3/2)', 'messages': ['1.5']},
		{'code': 'print(2/2)', 'messages': ['1']}, 
		// 1.0 is printed by Python 3.13.0
		// 1 is close enough in WebLogo.

	];
	processTranslateExecuteCases(cases, logger);
};