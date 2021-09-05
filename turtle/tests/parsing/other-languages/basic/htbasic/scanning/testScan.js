import { processScanTestCases } from
'../../../../processScanTestCases.js';
import { scan } from
'../../../../../../modules/parsing/other-languages/basic/htbasic/scanning/scan.js';

export function testScan(logger) {
	const cases = [
		{
			'code': '10!',
			'tokens': ['10', 'REM ']
		},
		{
			'code': 'print 10',
			'tokens': ['print', '10']
		},
		{
			'code': '! some comment',
			'tokens': ['REM some comment']
		},
		{
			'code': 'clear screen',
			'tokens': ['cls']
		},
		{
			'code': 'integer x',
			'tokens': ['defint', 'x']
		},
		{
			'code': 'sub s1(integer x',
			'tokens': ['sub', 's1', '(', 'x', 'as', 'integer']
		},
		{
			'code': 'sub s1(integer x)',
			'tokens': ['sub', 's1', '(', 'x', 'as', 'integer', ')']
		},
		{
			'code': 'sub s1(integer x, integer y)',
			'tokens': ['sub', 's1', '(', 'x', 'as', 'integer',
				',', 'y', 'as', 'integer', ')']
		},
		{
			'code': `sub s1
subend`,
			'tokens': ['sub', 's1',
			'end', 'sub']
		},
		{
			'code': `20    REPEAT
30 UNTIL Count=10`,
			'tokens': [
				'20', 'do',
				'30', 'loop', 'UNTIL',
				'Count', '=', '10'
			]
		},
		{
			'code': `while 1<2
end while`,
			'tokens': ['while', '1', '<', '2', 'wend']
		},
		{
			'code': `10 while 1<2
20 end while`,
			'tokens': ['10', 'while', '1', '<', '2', '20', 'wend']
		}
	];
	processScanTestCases(cases, scan, logger);
};