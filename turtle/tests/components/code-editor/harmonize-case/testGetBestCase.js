import { getBestCase } from '../../../../modules/components/code-editor/harmonize-case/getBestCase.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

export function testGetBestCase(logger) {
	const cases = [
		{'in': ['x', 'x'], 'out': 'x'},
		{'in': ['X', 'X'], 'out': 'X'},
		{'in': ['x', 'X'], 'out': 'x'},
		{'in': ['X', 'x'], 'out': 'x'},
	];
	testInOutPairs(cases, getBestCase, logger);
};