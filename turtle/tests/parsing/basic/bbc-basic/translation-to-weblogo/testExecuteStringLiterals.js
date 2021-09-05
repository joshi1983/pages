import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteStringLiterals(logger) {
	const cases = [
		{'code': 'print "hi"', 'messages': ['hi']},
		{'code': 'print ";"', 'messages': [';']},
		{'code': 'print ":"', 'messages': [':']},
		{'code': 'print "["', 'messages': ['[']},
		{'code': 'print "]"', 'messages': [']']},
		{'code': 'print "("', 'messages': ['(']},
		{'code': 'print ")"', 'messages': [')']},
	];
	processTranslateExecuteCases(cases, logger);
};