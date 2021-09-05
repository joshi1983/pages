import { clamp } from './clamp.js';
import { EventDispatcher } from './EventDispatcher.js';
import { fetchJson } from './fetchJson.js';
let colours;
let colourNameMap;

async function asyncInit() {
	colours = await fetchJson('json/colours.json');
	colourNameMap = new Map();
	colours.forEach(function(c) {
		colourNameMap.set(c.name.toLowerCase(), c.rgb);
		if (c.names instanceof Array)
			c.names.forEach(function(name) {
				colourNameMap.set(name.toLowerCase(), c.rgb);
			});
	});
}
const initPromise = asyncInit();

export class Colour extends EventDispatcher {
	static WHITE = new Colour('#fff');

	static asyncInit() {
		return initPromise;
	}

	constructor(rgbArray) {
		super(['change']);
		// if called like: new Colour(255, 0, 255)
		if (arguments.length === 3) { 
			rgbArray = [arguments[0], arguments[1], arguments[2]];
		}
		this.assign(rgbArray);
	}

	assign(rgbArray) {
		if (rgbArray instanceof Colour)
			rgbArray = rgbArray.rgbArray;
		else if (typeof rgbArray === 'number') {
			rgbArray = Math.floor(rgbArray) % 16;
			if (rgbArray >= 0) {
				rgbArray = colours[rgbArray].rgb;
			}
		}
		else if (typeof rgbArray === 'string') {
			rgbArray = rgbArray.trim();
			var newRGB;
			if (rgbArray.charAt(0) === '#')
				newRGB = Colour.parseHTMLCode(rgbArray);
			else {
				newRGB = Colour.getColourInfoByName(rgbArray);
				if (!(newRGB instanceof Array))
					throw new Error('Unrecognized colour name: ' + rgbArray);
			}
			rgbArray = newRGB;
		}
		else if (rgbArray.constructor.name === 'AlphaColour')
			throw new Error('Unable to create a Colour from an AlphaColour');
		if (rgbArray instanceof Array) {
			if (rgbArray.length !== 3)
				throw new Error('Colour must be given an array of length 3.  Not length ' + rgbArray.length);
			else {
				for (let i = 0; i < 3; i++) {
					if (typeof rgbArray[i] !== 'number' || isNaN(rgbArray[i]))
						throw new Error('Every RGB element must be a number.  rgbArray = ' + JSON.stringify(rgbArray));
				}
			}
		}
		else
			throw new Error('Colour requires a name, or [red, green, blue] array. rgbArray = ' + rgbArray);

		// if any change is really happening, update and dispatch the change event.
		if (this.rgbArray === undefined || this.rgbArray[0] !== rgbArray[0] || this.rgbArray[1] !== rgbArray[1] || this.rgbArray[2] !== rgbArray[2]) {
			this.rgbArray = rgbArray.map((num) => clamp(Math.round(num), 0, 255));
			this._dispatchEvent('change', {'colour': this});
		}
	}

	static canBeInterprettedAsColour(val) {
		if (val instanceof Colour)
			return true;
		if (typeof val === 'string')
			return Colour.isValidColourString(val);
		else if (val instanceof Array)
			return Colour.isValidRGBArray(val);
		else if (Number.isInteger(val) && val <= 15 && val >= 0)
			return true;
		return false;
	}

	equals(otherColour) {
		if (typeof otherColour === 'object' && otherColour !== null &&
		otherColour.constructor.name === 'AlphaColour')
			return otherColour.equals(this);
		if (!(otherColour instanceof Colour))
			return false;
		return this.toString() === otherColour.toString();
	}

	static getColourInfoByName(name) {
		name = name.trim().toLowerCase().replace(/\s+/g, '_');
		if (colourNameMap.has(name))
			return colourNameMap.get(name);
	}

	static getSanitizationTips(s) {
		if (Colour.isValidColourString(s))
			return; // no tips required.  Already valid.
		if (Colour.isValidColourString('#' + s))
			return 'Add # before your color code';
		if (s.replace(/#/g, '').length < s.length - 1)
			return 'There should be at most 1 # and it can only be at the beginning so remove it elsewhere';
	}

	isDark() {
		var totalBrightness = 0;
		this.rgbArray.forEach(function(v) {
			totalBrightness += v;
		});
		return totalBrightness < 128 * 3;
	}

	static isValidColourString(s) {
		if (typeof s !== 'string')
			return false;
		return Colour.getColourInfoByName(s) !== undefined ||
			Colour.isValidHTMLColourCode(s);
	}

	static isValidHTMLColourCode(s) {
		if (typeof s !== 'string' || (s.length !== 4 && s.length !== 7) || s.charAt(0) !== '#')
			return false;
		return /^[0-9A-F]+$/i.test(s.substring(1));
	}

	static isValidRGBArray(rgbArray) {
		if (rgbArray.length !== 3)
			return false;
		else {
			for (let i = 0; i < 3; i++) {
				if (typeof rgbArray[i] !== 'number' || isNaN(rgbArray[i]))
					return false;
			}
			return true;
		}
	}

	static numTo2DigitHex(num) {
		num = num.toString(16);
		if (num.length < 2)
			num = '0' + num;
		return num.toUpperCase();
	}

	static parseHTMLCode(htmlColourCode) {
		htmlColourCode = htmlColourCode.substring(1);
		if (htmlColourCode.length === 3) {
			let convertedCode = '';
			for (let i = 0; i < 3; i++) {
				const c = htmlColourCode.charAt(i);
				convertedCode += c + c;
			}
			htmlColourCode = convertedCode;
		}
		if (htmlColourCode.length !== 6)
			throw new Error('HTML Colour code must have 6 hex digits. Not: ' + htmlColourCode.length);
		const result = [];
		for (let i = 0; i < 3; i++) {
			const val = parseInt(htmlColourCode.substring(i * 2, i * 2 + 2), 16);
			if (isNaN(val))
				throw new Error('Unable to parse hex value from ' + htmlColourCode + '.  It appears to contain invalid hex digits.');
			result.push(val);
		}
		return result;
	}

	to6DigitHTMLCode() {
		var result = '#';
		for (var i = 0; i < this.rgbArray.length; i++)
			result += Colour.numTo2DigitHex(this.rgbArray[i]);
		return result;
	}

	toArray() {
		return this.rgbArray.slice(0);
	}

	toString() {
		return this.to6DigitHTMLCode();
	}
}