import { processScanTestCases } from '../../../processScanTestCases.js';
import { scan } from
'../../../../../modules/parsing/basic/sinclair-basic/scanning/scan.js';

export function testScan(logger) {
	const cases = [
		{'code': '', 'tokens': []},
		{
			'code': 'print “hi”',
			'tokens': ['print', '"hi"']
		}
	];
	processScanTestCases(cases, scan, logger);
};