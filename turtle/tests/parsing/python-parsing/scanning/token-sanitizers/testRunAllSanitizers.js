import { processSanitizeTestCases } from './processSanitizeTestCases.js';
import { runAllSanitizers } from
'../../../../../modules/parsing/python-parsing/scanning/token-sanitizers/runAllSanitizers.js';

export function testRunAllSanitizers(logger) {
	const cases = [
		{'code': '# hi', 'tokens': ['# hi']},
		{'code': 'print("hi") # hi', 'tokens': ['print', '(', '"hi"', ')', '# hi']},
		{'code': 'print("hi")\n# hi', 'tokens': ['print', '(', '"hi"', ')', '# hi']},
		{'code': '# hi\nprint("hi") ', 'tokens': ['# hi', 'print', '(', '"hi"', ')']}
	];
	processSanitizeTestCases(cases, runAllSanitizers, logger);
};