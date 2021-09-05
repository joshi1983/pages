import { getLightness } from '../../modules/colour/getLightness.js';
import { processColourTestCases } from './processColourTestCases.js';

export function testGetLightness(logger) {
	const cases = [
	{"in": "#000", "out": 0},
	{"in": "#111111", "out": 17},
	{"in": "#f00", "out": 127.5},
	{"in": "#0f0", "out": 127.5},
	{"in": "#00f", "out": 127.5},
	{"in": "#fff", "out": 255}
	];
	processColourTestCases(cases, getLightness, logger);
};