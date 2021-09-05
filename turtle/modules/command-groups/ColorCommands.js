import { alphacolorToAlpha } from '../colour/alphacolorToAlpha.js';
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

	randomColor() {
		return [
			Math.floor(256 * Math.random()),
			Math.floor(256 * Math.random()),
			Math.floor(256 * Math.random())
		];
	}

	transparent() {
		return Transparent;
	}
};