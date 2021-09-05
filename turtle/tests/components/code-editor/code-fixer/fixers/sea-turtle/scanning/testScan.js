import { LogoScanner } from
'../../../../../../../modules/parsing/LogoScanner.js';
import { processScanTestCases } from
'../../../../../../parsing/processScanTestCases.js';
import { scan } from
'../../../../../../../modules/components/code-editor/code-fixer/fixers/sea-turtle/scanning/scan.js';

await LogoScanner.asyncInit();

export function testScan(logger) {
	const cases = [
		{'code': '; some comment', 'tokens': ['; some comment']},
		{'code': 'sub p\nend', 'tokens': ['to', 'p', '\n', 'end']},
		{'code': 'set x  1\nset y  2\nx != y',
			'tokens': ['make', '"x', '1', '\n',
				'make', '"y', '2', '\n',
				':x', '<>', ':y']},
		{'code': 'repeat 3', 'tokens': ['repeat', '3']},
		{'code': 'print "hi"', 'tokens': ['print', '"hi"']},
		{'code': 'print "hi"\nprint "yay"',
			'tokens': ['print', '"hi"', '\n', 'print', '"yay"']},
		{'code': 'print "hello world"', 'tokens': ['print', '\'hello world\'']},
		{'code': 'print "hello  world"', 'tokens': ['print', '\'hello  world\'']},
		{'code': 'print 1+2', 'tokens': ['print', '1', '+', '2']},
		{'code': 'set x 3', 'tokens': ['make', '"x', '3']},
		{'code': 'set x "hello world"', 'tokens': ['make', '"x', '\'hello world\'']},
		{'code': 'set x 3\nprint x', 'tokens': ['make', '"x', '3', '\n', 'print', ':x']},
		{'code': 'set xyz 3\nforward xyz', 'tokens': ['make', '"xyz', '3', '\n', 'forward', ':xyz']},
		{'code': 'set x "Bob"\nprint "hi$x"',
			'tokens': ['make', '"x', '"Bob"', '\n', 'print', '(', 'word', '"hi', 'str', ':x', ')']},
		{'code': 'set x "Bob"\nprint "hi $x"',
			'tokens': ['make', '"x', '"Bob"', '\n', 'print', '(', 'word', '\'hi \'', 'str', ':x', ')']},
		{'code': 'set x "Bob"\nprint "hi $x world"',
			'tokens': ['make', '"x', '"Bob"', '\n', 'print', '(', 'word', '\'hi \'', 'str', ':x', '\' world\'', ')']},
		{'code': `repeat 3
	print "hi"
end`, 'tokens': ['repeat', '3', '[', '\n', 'print', '"hi"', '\n', ']']},
		{'code': `repeat 3 repeat 5
	print "hi"
end
end`, 'tokens': ['repeat', '3', '[', 'repeat', '5', '[', '\n',
'print', '"hi"', '\n', ']', '\n', ']']},
		{'code': 'end', 'tokens': []}, // fix the unmatched end by removing it.
		{'code': `if 1 < 2
	print 123
end`, 'tokens': ['if', '1', '<', '2', '[', '\n', 'print', '123', '\n', ']']},
		{'code': `sub subroutine123
end
call subroutine123`, 'tokens': ['to', 'subroutine123', '\n', 'end', '\n', 'subroutine123']},
		{'code': 'BACKGROUND GREEN', 'tokens': ['setScreenColor', '"green']},
		{'code': 'BACKGROUND 1', 'tokens': ['setScreenColor', '"blue']},
		{'code': 'COLOR 1', 'tokens': ['setPenColor', '"blue']},
	];
	processScanTestCases(cases, scan, logger);
};