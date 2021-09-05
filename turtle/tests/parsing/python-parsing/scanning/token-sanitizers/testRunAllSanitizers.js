import { processSanitizeTestCases } from './processSanitizeTestCases.js';
import { runAllSanitizers } from
'../../../../../modules/parsing/python-parsing/scanning/token-sanitizers/runAllSanitizers.js';

export function testRunAllSanitizers(logger) {
	const cases = [
		{'code': '# hi', 'tokens': ['# hi']},
		{'code': 'print("hi") # hi', 'tokens': ['print', '(', '"hi"', ')', '# hi']},
		{'code': 'print("hi")\n# hi', 'tokens': ['print', '(', '"hi"', ')', '# hi']},
		{'code': '# hi\nprint("hi") ', 'tokens': ['# hi', 'print', '(', '"hi"', ')']},
		{'code': `import turtle   #Outside_In
import turtle`, 'tokens': ['import', 'turtle', '#Outside_In', 'import', 'turtle']}
	];
	processSanitizeTestCases(cases, runAllSanitizers, logger);
};