import { processSanitizeTestCases } from './processSanitizeTestCases.js';
import { removeUnusedIndents } from
'../../../../../modules/parsing/python-parsing/scanning/token-sanitizers/removeUnusedIndents.js';

export function testRemoveUnusedIndents(logger) {
	const cases = [
		{'code': '', 'tokens': []},
		{'code': 'print 3',
			'tokens': ['print', '3']},
		{'code': 'print 3 # hi',
			'tokens': ['print', '3', '# hi']},
		{'code': 'print 3\t',
			'tokens': ['print', '3']},
		{'code': '\tprint 3',
			'tokens': ['\t', 'print', '3']},
		{'code': '\t\tprint 3',
			'tokens': ['\t', '\t', 'print', '3']},
		{'code': 'while True:\n\tprint 3',
			'tokens': ['while', 'True', ':', '\t', 'print', '3']},
	];
	processSanitizeTestCases(cases, removeUnusedIndents, logger);
};