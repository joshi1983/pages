import { processScanTestCases } from
'../../../../processScanTestCases.js';
import { scan } from
'../../../../../../modules/parsing/other-languages/basic/htbasic/scanning/scan.js';

export function testScan(logger) {
	const cases = [
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
	];
	processScanTestCases(cases, scan, logger);
};