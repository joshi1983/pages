import { processScanTestCases } from '../../../../processScanTestCases.js';
import { scan } from
'../../../../../../modules/parsing/other-languages/basic/liberty-basic/scanning/scan.js';

export function testScan(logger) {
	const cases = [
		{
			'code': '',
			'tokens': []
		},
		{
			'code': '[x]',
			'tokens': ['x', ':']
		},
		{
			'code': 'gosub [bla]',
			'tokens': ['gosub', 'bla']
		},
		{
			'code': 'goto [bla]',
			'tokens': ['goto', 'bla']
		}
	];
	processScanTestCases(cases, scan, logger);
};