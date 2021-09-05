import { testGetAverageColour } from './testGetAverageColour.js';
import { testGetBlue } from './testGetBlue.js';
import { testGetGreen } from './testGetGreen.js';
import { testGetHSIIntensity } from './testGetHSIIntensity.js';
import { testGetHSVValue } from './testGetHSVValue.js';
import { testGetLightness } from './testGetLightness.js';
import { testGetRed } from './testGetRed.js';
import { testGetShortestRGBHexCode } from './testGetShortestRGBHexCode.js';
import { wrapAndCall } from '../helpers/wrapAndCall.js';

export function testColourDirectory(logger) {
	wrapAndCall([
		testGetAverageColour,
		testGetBlue,
		testGetGreen,
		testGetHSIIntensity,
		testGetHSVValue,
		testGetLightness,
		testGetRed,
		testGetShortestRGBHexCode
	], logger);
};