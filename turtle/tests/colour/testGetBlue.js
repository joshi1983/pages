import { getBlue } from '../../modules/colour/getBlue.js';
import { processColourTestCases } from './processColourTestCases.js';

export function testGetBlue(logger) {
	const cases = [
	{'in': '#f00', 'out': 0},
	{'in': '#8f00', 'out': 0},
	{'in': '#000', 'out': 0},
	{'in': '#0000', 'out': 0},
	{'in': '#00f', 'out': 255},
	{'in': '#800f', 'out': 255},
	];
	processColourTestCases(cases, getBlue, logger);
};