import { processScanTestCases } from '../../../processScanTestCases.js';
import { scan } from '../../../../../modules/parsing/l-systems/fractint/scanning/scan.js';

export function testScan(logger) {
	const cases = [
		{'code': '; comment', 'tokens': ['; comment']},
		{'code': 'angle 8', 'tokens': ['angle', '=', '8']},
		{'code': 'A = N', 'tokens': ['A', '->', 'N']},
		{'code': 'X = >F[+A(4)]FY',
			'tokens': ['X', '->', '>', 'F', '[', '+', 'A', '(', '4', ')', ']', 'F', 'Y']}
	];
	processScanTestCases(cases, scan, logger);
};