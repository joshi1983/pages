import { processScanTestCases } from '../../../processScanTestCases.js';
import { scan } from
'../../../../../modules/parsing/basic/sinclair-basic/scanning/scan.js';

export function testScan(logger) {
	const cases = [
		{'code': '', 'tokens': []},
	];
	processScanTestCases(cases, scan, logger);
};