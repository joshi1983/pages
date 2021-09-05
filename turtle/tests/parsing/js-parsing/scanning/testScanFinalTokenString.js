import { scanFinalTokenString } from '../../../../modules/parsing/js-parsing/scanning/scanFinalTokenString.js';
import { processScanTestCases } from '../../processScanTestCases.js';

function wrappedScan(s) {
	return scanFinalTokenString(s, 0, 0);
}

export function testScanFinalTokenString(logger) {
	const cases = [
	{'code': '', 'len': 0},
	{'code': 'a', 'len': 1},
	{'code': 'ab', 'len': 1},
	{'code': '/', 'len': 1},
	{'code': '/=', 'len': 1},
	{'code': '/=a', 'len': 2, 'tokens': [
		{'s': '/='},
		{'s': 'a'}
	]},
	];
	processScanTestCases(cases, wrappedScan, logger);
};