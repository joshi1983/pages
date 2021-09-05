import { processScanTestCases } from '../../../processScanTestCases.js';
import { scanToQBasicTokens } from
'../../../../../modules/parsing/basic/commodore-basic/scanning/scanToQBasicTokens.js';

export function testScanToQBasicTokens(logger) {
	const cases = [
		{
			'code': 'print 10',
			'tokens': ['print', '10']
		}
	];
	processScanTestCases(cases, scanToQBasicTokens, logger);
};