import { fontWeight } from '../../../../modules/parsing/parse-tree-analysis/string-formats/fontWeight.js';
import { processStringFormatTestCases } from './processStringFormatTestCases.js';

export function testFontWeight(logger) {
	const cases = [
		{'s': 'bold', 'error': false},
		{'s': 'normal', 'error': false},
		{'s': 'butt', 'error': true},
		{'s': 'rnd', 'error': true}
	];
	processStringFormatTestCases(cases, logger, fontWeight);
};