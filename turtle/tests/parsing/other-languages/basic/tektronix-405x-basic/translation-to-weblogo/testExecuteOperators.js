import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteOperators(logger) {
	const cases = [
		{'code': 'x=3\nprint x', 'messages': ['3']},
		{'code': 'x=1+3\nprint x', 'messages': ['4']},
		{'code': 'x=2*3\nprint x', 'messages': ['6']},
		{'code': 'print 1>2', 'messages': ['false']},
		{'code': 'print 3>2', 'messages': ['true']},
		{'code': 'print 1<>2', 'messages': ['true']},
		{'code': 'print 1<>1', 'messages': ['false']},
		{'code': 'print 1=<2', 'messages': ['true']},
		{'code': 'print 2=<2', 'messages': ['true']},
		{'code': 'print 3=<2', 'messages': ['false']},
		{'code': 'print 3=>2', 'messages': ['true']},
		{'code': 'print 2=>2', 'messages': ['true']},
		{'code': 'print 1=>2', 'messages': ['false']},
		{'code': 'print 1=2', 'messages': ['false']},
		{'code': 'print 1=1', 'messages': ['true']},
	];
	processTranslateExecuteCases(cases, logger);
};