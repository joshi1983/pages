import { processTranslateExecuteCases } from './processTranslateExecuteCases.js';

export function testExecuteLiteralValues(logger) {
	const cases = [
		{'code': 'print "hi"', 'messages': ['hi']},
		{'code': "print 'hi'", 'messages': ['hi']},
		{'code': "print('hi')", 'messages': ['hi']},
		{'code': 'print("hi")', 'messages': ['hi']},
		{'code': "print(1)", 'messages': ['1']},
		{'code': "print(-1)", 'messages': ['-1']},
		{'code': "print(2)", 'messages': ['2']},
		{'code': "print(1.5)", 'messages': ['1.5']},
		{'code': "print(True)", 'messages': ['true']},
		{'code': "print(False)", 'messages': ['false']},
	];
	processTranslateExecuteCases(cases, logger);
};