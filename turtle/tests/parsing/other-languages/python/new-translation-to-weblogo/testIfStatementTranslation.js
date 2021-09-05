import { processTranslationTestCases } from './processTranslationTestCases.js';

export function testIfStatementTranslation(logger) {
	const cases = [
		{'in': 'if True:\n\tprint("hi")', 'out': 'if true [\n\tprint "hi\n]'},
		{'in': 'if True:\n\tprint("hi") \nelse:\n\tprint("bye")',
			'out': 'ifelse true [\n\tprint "hi\n] [\n\tprint "bye\n]'},
		{'in': 'if b > a:\n\tprint("case1")\nelif a == b:\n\tprint("case2")',
			'out': 'ifelse :b > :a [\n\tprint "case1\n] [\n\tif :a = :b [\n\t\tprint "case2\n\t]\n]'},
		{'in': 'if b > a:\n\tprint("case1")\nelif a == b:\n\tprint("case2")\nelse:\n\tprint("case3")',
			'out': 'ifelse :b > :a [\n\tprint "case1\n] [\n\tifelse :a = :b [\n\t\tprint "case2\n\t] [\n\t\tprint "case3\n\t]\n]'},
		{'in': 'if abs(pos()) < 1:\n\tbreak',
			'out': 'if ( hypot pos ) < 1 [\n\tbreak\n]'},
		{'in': 'if abs(pos()) < 1:\n\tcontinue',
			'out': 'if ( hypot pos ) < 1 [\n\tcontinue\n]'},
		{'in': `if _name_ == '__main__':\n\tprint("hi")`,
		'out': 'print "hi'},
		{'in': `if m==0 or m==60:
	print(4)`, 'out': `if ( or :m = 0 :m = 60 ) [
	print 4
]`}
	];
	processTranslationTestCases(cases, logger);
};