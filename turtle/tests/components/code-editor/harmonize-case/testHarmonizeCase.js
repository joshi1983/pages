import { harmonizeCase } from
'../../../../modules/components/code-editor/harmonize-case/harmonizeCase.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testHarmonizeCase(logger) {
	const cases = [
		{'in': 'print true', 'changed': false},
		{'in': 'print false', 'changed': false},
		{'in': 'PRINT 3', 'out': 'print 3'}
	];
	testInOutPairs(cases, harmonizeCase, logger);
};