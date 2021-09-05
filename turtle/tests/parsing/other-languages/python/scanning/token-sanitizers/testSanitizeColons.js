import { processSanitizeTestCases } from './processSanitizeTestCases.js';
import { sanitizeColons } from
'../../../../../../modules/parsing/other-languages/python/scanning/token-sanitizers/sanitizeColons.js';

export function testSanitizeColons(logger) {
	const cases = [
		{'code': '', 'tokens': []},
		{'code': 'try print "hi"',
			'tokens': ['try', ':', 'print', '"hi"']},
		{'code': 'try print "hi" finally print "finally"',
			'tokens': ['try', ':', 'print', '"hi"', 'finally', ':', 'print', '"finally"']}
	];
	processSanitizeTestCases(cases, sanitizeColons, logger);
};