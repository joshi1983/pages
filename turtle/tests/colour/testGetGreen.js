import { getGreen } from '../../modules/colour/getGreen.js';
import { processColourTestCases } from './processColourTestCases.js';

export function testGetGreen(logger) {
	const cases = [
	{'in': '#f00', 'out': 0},
	{'in': '#8f00', 'out': 0},
	{'in': '#000', 'out': 0},
	{'in': '#0000', 'out': 0},
	{'in': '#0f0', 'out': 255},
	{'in': '#80f0', 'out': 255},
	];
	processColourTestCases(cases, getGreen, logger);
};