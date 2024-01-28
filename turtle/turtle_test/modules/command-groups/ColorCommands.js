import { getBlue } from '../colour/getBlue.js';
import { getGreen } from '../colour/getGreen.js';
import { getHSIIntensity } from '../colour/getHSIIntensity.js';
import { getHSVValue } from '../colour/getHSVValue.js';
import { getLightness } from '../colour/getLightness.js';
import { getRed } from '../colour/getRed.js';
import { Transparent } from '../Transparent.js';

export class ColorCommands {
	constructor() {
		this.colorToBlue = getBlue;
		this.colorToGreen = getGreen;
		this.colorToIntensity = getHSIIntensity;
		this.colorToLightness = getLightness;
		this.colorToValue = getHSVValue;
		this.colorToRed = getRed;
	}

	transparent() {
		return Transparent;
	}
};