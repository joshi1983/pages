import { stepPosition } from '../../../../modules/parsing/parse-tree-analysis/string-formats/stepPosition.js';
import { processStringFormatTestCases } from './processStringFormatTestCases.js';

export function testStepPosition(logger) {
	const cases = [
		{'s': 'jumps', 'error': true},
		{'s': 'jumpEnd', 'error': false},
		{'s': 'jumpstart', 'error': false},
		{'s': 'jumpboth', 'error': false}
	];
	processStringFormatTestCases(cases, logger, stepPosition);
};