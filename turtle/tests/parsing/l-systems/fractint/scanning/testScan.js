import { processScanTestCases } from '../../../processScanTestCases.js';
import { scan } from '../../../../../modules/parsing/l-systems/fractint/scanning/scan.js';

export function testScan(logger) {
	const cases = [
		{'code': '; comment', 'tokens': ['; comment']},
		{'code': 'x {', 'tokens': []},
		{'code': 'x {}', 'tokens': []},
		{'code': 'x {\naxiom F}', 'tokens': ['axiom', '=', 'F']},
		{'code': 'x {\nangle 30}', 'tokens': ['angle', '=', '30']},
		{'code': 'x {\nangle 30\naxiom F}',
			'tokens': ['angle', '=', '30', 'axiom', '=', 'F']},
		{'code': 'x {\nF=FF}',
			'tokens': ['F', '->', 'F', 'F']},
	];
	processScanTestCases(cases, scan, logger);
};