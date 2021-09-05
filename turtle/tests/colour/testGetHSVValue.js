import { getHSVValue } from '../../modules/colour/getHSVValue.js';
import { processColourTestCases } from './processColourTestCases.js';

export function testGetHSVValue(logger) {
	/*
	Similar cases were tried with to get the same results:
	https://www.rapidtables.com/convert/color/rgb-to-hsv.html
	*/
	const cases = [
	{"in": "#000", "out": 0},
	{"in": "#f00", "out": 255},
	{"in": "#0f0", "out": 255},
	{"in": "#00f", "out": 255},
	{"in": "#fff", "out": 255}
	];
	processColourTestCases(cases, getHSVValue, logger);
};