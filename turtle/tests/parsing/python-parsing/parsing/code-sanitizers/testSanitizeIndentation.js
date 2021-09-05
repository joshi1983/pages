import { sanitizeIndentation } from
'../../../../../modules/parsing/python-parsing/parsing/code-sanitizers/sanitizeIndentation.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

export function testSanitizeIndentation(logger) {
	const cases = [
		{'in': '', 'changed': false},
		{'in': '\n', 'changed': false},
		{'in': '\n\n', 'changed': false},
		{'in': 'print "hi"', 'changed': false},
		{'in': 'print "hi"\nprint 3', 'changed': false},
		{'in': 'if True:\n\tprint "hi"', 'changed': false},
		{'in': 'if True:\n\tprint("hi")', 'changed': false},
		{'in': 'if True:\n\t print("hi")',
			'out': 'if True:\n\tprint("hi")'},
		{'in': 'if True:\n print("hi")',
			'out': 'if True:\n\tprint("hi")'},
		{'in': 'if True:\n print("hi")\n  print("yo")',
			'out': 'if True:\n\tprint("hi")\n\tprint("yo")'},
		{'in': 'print("hi")\nif True:\n print("hi")',
			'out': 'print("hi")\nif True:\n\tprint("hi")'}
	];
	testInOutPairs(cases, sanitizeIndentation, logger);
};