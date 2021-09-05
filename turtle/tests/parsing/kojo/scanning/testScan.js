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
	];
	processScanTestCases(cases, scan, logger);
};