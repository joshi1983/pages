import { alphacolorToAlpha } from '../colour/alphacolorToAlpha.js';
import { Colour } from '../Colour.js';
import { getBlue } from '../colour/getBlue.js';
import { getGreen } from '../colour/getGreen.js';
import { getHSIIntensity } from '../colour/getHSIIntensity.js';
import { getHSVValue } from '../colour/getHSVValue.js';
import { getLightness } from '../colour/getLightness.js';
import { getRed } from '../colour/getRed.js';
import { hsvToRGB } from './helpers/hsvToRGB.js';
import { rgbToHSV } from './helpers/rgbToHSV.js';
import { Transparent } from '../Transparent.js';

export class ColorCommands {
	constructor() {
		this.hsvToRGB = hsvToRGB;
		this.rgbToHSV = rgbToHSV;
		this.alphacolorToAlpha = alphacolorToAlpha;
		this.colorp = Colour.canBeInterprettedAsColour;
		this.colorToBlue = getBlue;
		this.colorToGreen = getGreen;
		this.colorToIntensity = getHSIIntensity;
		this.colorToLightness = getLightness;
		this.colorToValue = getHSVValue;
		this.colorToRed = getRed;
	}

	colorToHexCode(c) {
		return c.toString();
	}

	transparent() {
		return Transparent;
	}
};