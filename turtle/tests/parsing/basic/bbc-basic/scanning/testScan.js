import { processScanTestCases } from '../../../processScanTestCases.js';
import { scan } from '../../../../../modules/parsing/basic/bbc-basic/scanning/scan.js';

export function testScan(logger) {
	const cases = [
		{
			'code': 'print 10',
			'tokens': ['print', '10']
		},
		{
			'code': 'print &10',
			'tokens': ['print', '&10']
		},
		{
			'code': 'print ~&10',
			'tokens': ['print', '~&10']
		},
		{
			'code': 'print ~10',
			'tokens': ['print', '~', '10']
		},
		{
			'code': 'PRINT ABS(-5.5)',
			'tokens': ['PRINT', 'ABS', '(', '-5.5', ')']
		},
		{
			'code': '@%=&0002020A',
			'tokens': [
				{'s': '@%', 'colIndex': 1},
				{'s': '=', 'colIndex': 2},
				{'s': '&0002020A', 'colIndex': 11}
			]
		},
		{
			'code': 'print “hi”',
			'tokens': ['print', '"hi"']
		}
	];
	processScanTestCases(cases, scan, logger);
};