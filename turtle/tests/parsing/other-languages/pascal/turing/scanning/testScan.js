import { processScanTestCases } from
'../../../../processScanTestCases.js';
import { scan } from
'../../../../../../modules/parsing/other-languages/pascal/turing/scanning/scan.js';

export function testScan(logger) {
	const cases = [
		{'code': 'aa', 'tokens': [{
			's': 'aa',
			'colIndex': 1,
			'lineIndex': 0
		}]},
		{'code': '1.', 'tokens': [{
			's': '1.',
			'colIndex': 1,
			'lineIndex': 0
		}]},
		{'code': '..', 'tokens': [{
			's': '..',
			'colIndex': 1,
			'lineIndex': 0
		}]},
		{'code': '% comment', 'tokens': ['% comment']},
		{'code': '% comment\n', 'tokens': ['% comment']},
		{'code': '/* comment */', 'tokens': ['/* comment */']},
		{'code': '/* comment\n */', 'tokens': ['/* comment\n */']},
		{'code': '/*// comment //*/', 'tokens': ['/*// comment //*/']},
		{'code': 'var x', 'tokens': ['var', 'x']},
		{'code': 'x:=3', 'tokens': ['x', ':=', '3']},
		{'code': '1..10', 'tokens': ['1', '..', '10']},
		{'code': '..10', 'tokens': ['..', '10']},
		{'code': '..x', 'tokens': ['..', 'x']},
		{'code': '3..x', 'tokens': ['3', '..', 'x']},
		{'code': '3..', 'tokens': ['3', '..']},
		{'code': '..-10', 'tokens': ['..', '-10']},
		{'code': 'print 2-3', 'tokens': ['print', '2', '-', '3']},
		{'code': 'print x not= y', 'tokens': ['print', 'x', 'not=', 'y']},
		{'code': 'for i : 1..10', 'tokens': ['for', 'i', ':', '1', '..', '10']},
		{'code': 'put i, ", "', 'tokens': ['put', 'i', ',', '", "']},
		{'code': 'put "hello world"', 'tokens': ['put', '"hello world"']},
		{'code': 'put x**y', 'tokens': ['put', 'x', '**', 'y']},
		{'code': '(shades)', 'tokens': ['(', 'shades', ')']},
		{'code': 'if x < 12 then', 'tokens': ['if', 'x', '<', '12', 'then']},
		{
			'code': '”hello world”',
			'tokens': ['"hello world"']
		},
		{
			'code': '“A”',
			'tokens': ['"A"']
		},
		{
			'code': '“hello world”',
			'tokens': ['"hello world"']
		},
		{
			'code': 'x:=:=3',
			'tokens': ['x', ':=', '3']
		}, // should be fixed by removeInvalidatingTokens
		{
			'code': 'var x::= 3',
			'tokens': ['var', 'x', ':=', '3']
		}, // should be fixed by removeInvalidatingTokens
		{
			'code': 'not in',
			'tokens': ['not in']
		},
		{
			'code': 'NOT In',
			'tokens': ['NOT In']
		},
		{
			'code': 'not i',
			'tokens': ['not', 'i']
		},
		{
			'code': 'not =',
			'tokens': ['not=']
			// sanitization should join them because not= is the only way to make sense of the code.
		}
	];
	processScanTestCases(cases, scan, logger);
};