import { getHSIIntensity } from '../../modules/colour/getHSIIntensity.js';
import { processColourTestCases } from './processColourTestCases.js';

export function testGetHSIIntensity(logger) {
	const cases = [
	{"in": "#000", "out": 0},
	{"in": "#111111", "out": 17},
	{"in": "#f00", "out": 85},
	{"in": "#0f0", "out": 85},
	{"in": "#00f", "out": 85},
	{"in": "#fff", "out": 255}
	];
	processColourTestCases(cases, getHSIIntensity, logger);
};