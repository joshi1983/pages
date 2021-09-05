import { processScanTestCases } from '../../../processScanTestCases.js';
import { scan } from
'../../../../../modules/parsing/basic/sinclair-basic/scanning/scan.js';

export function testRemoveSpacesInFunctionNames(logger) {
	const cases = [
		{'code': 'FN', 'tokens': ['FN']},
		{'code': 'f', 'tokens': ['f']},
		{'code': 'FN f', 'tokens': ['FN', 'f']},
		// no merge because it isn't obvious to be a function call.  The ( and preceding def are not there.

		{'code': 'FN f()', 'tokens': ['FN_f', '(', ')']},
		{'code': 'FN f\n()', 'tokens': ['FN', 'f', '(', ')']}, // the line break would be too weird for Sinclair.
		{'code': 'def FN f', 'tokens': ['def', 'FN_f']},
	];
	processScanTestCases(cases, scan, logger);
};