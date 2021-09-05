import { processScanTestCases } from '../../../../processScanTestCases.js';
import { scan } from
'../../../../../../modules/parsing/other-languages/basic/sinclair-basic/scanning/scan.js';

export function testScan(logger) {
	const cases = [
		{'code': '', 'tokens': []},
		{
			'code': 'print “hi”',
			'tokens': ['print', '"hi"']
		},
		{
			'code': 'go to 100',
			'tokens': ['goto', '100']
			// we want it more like QBasic code so QBasic's parse and translate 
			// will process the goto statements better.
		}
	];
	processScanTestCases(cases, scan, logger);
};