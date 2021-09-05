import { lineCap } from '../../../../modules/parsing/parse-tree-analysis/string-formats/lineCap.js';
import { processStringFormatTestCases } from './processStringFormatTestCases.js';

export function testLineCap(logger) {
	const cases = [
		{'s': 'round', 'error': false},
		{'s': 'square', 'error': false},
		{'s': 'butt', 'error': false},
		{'s': 'rnd', 'error': true}
	];
	processStringFormatTestCases(cases, logger, lineCap);
};