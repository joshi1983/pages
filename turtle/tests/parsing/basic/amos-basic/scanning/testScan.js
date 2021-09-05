import { processScanTestCases } from '../../../processScanTestCases.js';
import { scan } from
'../../../../../modules/parsing/basic/amos-basic/scanning/scan.js';

export function testScan(logger) {
	const cases = [
		{'code': '', 'tokens': []},
		{'code': 'screen 1', 'tokens': ['screen', '1']},
		{'code': 'Screen Open 0,320,256,2,0', 'tokens': []},
		{'code': 'procedure a\nend proc', 'tokens': ['sub', 'a', 'end', 'sub']},
		{'code': 'add x,1', 'tokens': ['x', '=', 'x', '+', '1']},
	];
	processScanTestCases(cases, scan, logger);
};