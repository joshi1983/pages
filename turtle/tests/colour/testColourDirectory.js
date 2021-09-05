import { prefixWrapper } from '../helpers/prefixWrapper.js';
import { testGetBlue } from './testGetBlue.js';
import { testGetGreen } from './testGetGreen.js';
import { testGetHSIIntensity } from './testGetHSIIntensity.js';
import { testGetHSVValue } from './testGetHSVValue.js';
import { testGetLightness } from './testGetLightness.js';
import { testGetRed } from './testGetRed.js';

export function testColourDirectory(logger) {
	testGetBlue(prefixWrapper('testGetBlue', logger));
	testGetGreen(prefixWrapper('testGetGreen', logger));
	testGetHSIIntensity(prefixWrapper('testGetHSIIntensity', logger));
	testGetHSVValue(prefixWrapper('testGetHSVValue', logger));
	testGetLightness(prefixWrapper('testLightness', logger));
	testGetRed(prefixWrapper('testGetRed', logger));
};