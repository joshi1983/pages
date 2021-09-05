import { processScanTestCases } from '../../../processScanTestCases.js';
import { scan } from
'../../../../../modules/parsing/basic/basil/scanning/scan.js';

export function testScan(logger) {
	const cases = [
		{'code': '', 'tokens': []},
		{'code': '\' comment', 'tokens': ['\' comment']},
		{
			'code': 'print “hi”',
			'tokens': ['print', '"hi"']
		}
	];
	processScanTestCases(cases, scan, logger);
};