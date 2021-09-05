import { Operators } from
'../../../../modules/parsing/kojo/Operators.js';
import { processScanTestCases } from
'../../processScanTestCases.js';
import { scan } from
'../../../../modules/parsing/kojo/scanning/scan.js';

export function testScan(logger) {
	const cases = [
		{'code': '', 'len': 0},
		{'code': ',', 'tokens': [',']},
		{'code': 'right()',
			'tokens': ['right', '(', ')']},
		{'code': 'setSpeed(fast)',
			'tokens': ['setSpeed', '(', 'fast', ')']},
		{'code': 'val x = 3', 'tokens': ['val', 'x', '=', '3']},
		{'code': '1+2', 'tokens': ['1', '+', '2']},
		{'code': '~A', 'tokens': ['~', 'A']},
		{'code': '~2', 'tokens': ['~', '2']},
		{'code': 'A^B', 'tokens': ['A', '^', 'B']},
		{'code': 'x=2', 'tokens': ['x', '=', '2']},
		{'code': 'x==2', 'tokens': ['x', '==', '2']},
		{'code': 'x!=2', 'tokens': ['x', '!=', '2']},
		{'code': '=>', 'tokens': ['=>']},
		{'code': 'for (x <- 3', 'tokens': ['for', '(', 'x', '<-', '3']},
		{'code': 'class SHtm (var s:String){',
			'tokens': ['class', 'SHtm', '(', 'var', 's',
			':', 'String', ')', '{']
		},
		{'code': '@main', 'tokens': ['@main']},
		{'code': '@deprecated("deprecation message", "release # which deprecates method")', 'tokens': [
			'@deprecated', '(', '"deprecation message"', ',', '"release # which deprecates method"', ')'
		]}
	];
	for (const opInfo of Operators.getAll()) {
		cases.push({
			'code': opInfo.symbol,
			'tokens': [opInfo.symbol]
		});
	}
	processScanTestCases(cases, scan, logger);
};