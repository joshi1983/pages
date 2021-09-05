import { getRed } from '../../modules/colour/getRed.js';
import { processColourTestCases } from './processColourTestCases.js';

export function testGetRed(logger) {
	const cases = [
	{'in': '#f00', 'out': 255},
	{'in': '#8f00', 'out': 255},
	{'in': '#000', 'out': 0},
	{'in': '#0000', 'out': 0}
	];
	processColourTestCases(cases, getRed, logger);
};