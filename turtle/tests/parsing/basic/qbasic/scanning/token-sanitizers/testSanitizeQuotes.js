import { processTokenSanitizersTestCases } from
'./processTokenSanitizersTestCases.js';
import { sanitizeQuotes } from
'../../../../../../modules/parsing/basic/qbasic/scanning/token-sanitizers/sanitizeQuotes.js';

export function testSanitizeQuotes(logger) {
	const cases = [
		{
			'code': '"hi"',
			'tokens': ['"hi"'] // no change
		},
		{
			'code': '“A"',
			'tokens': ['"A"'] // replace the “ with ".
		},
		{
			'code': '“A”',
			'tokens': ['"A"']
		}
	];
	processTokenSanitizersTestCases(cases, sanitizeQuotes, logger);
};