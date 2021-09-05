import { cleanBorderSize } from '../../../modules/components/svg-drawing-viewer/cleanBorderSize.js';
import { testInOutPairs } from '../../helpers/testInOutPairs.js';

export function testCleanBorderSize(logger) {
	const cases = [
		{'in': '5px', 'out': 5},
		{'in': '15px', 'out': 15},
		{'in': '0', 'out': 0},
		{'in': undefined, 'out': 0},
	];
	testInOutPairs(cases, cleanBorderSize, logger);
};