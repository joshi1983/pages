import { clamp } from './clamp.js';
import { Colour } from './Colour.js';
import { EventDispatcher } from './EventDispatcher.js';
import { isNumber } from './isNumber.js';

export class AlphaColour extends EventDispatcher {
	static asyncInit() {
		return Colour.asyncInit();
	}

	constructor(val) {
		super(['change']);
		// if called like: new AlphaColour(255, 0, 255)
		if (arguments.length === 3) { 
			val = [255, arguments[0], arguments[1], arguments[2]];
		}
		else if (arguments.length === 4) {
			val = [arguments[0], arguments[1], arguments[2], arguments[3]];
		}
		this.alpha = 255;
		if (val !== undefined)
			this.assign(val);
	}

	assign(rgbArray) {
		if (typeof rgbArray === 'number')
			rgbArray = new Colour(rgbArray);
		if (rgbArray instanceof Colour)
			rgbArray = [255, ...rgbArray.rgbArray];
		else if (rgbArray instanceof AlphaColour)
			rgbArray = [rgbArray.alpha, ...rgbArray.rgbArray];
		else if (typeof rgbArray === 'string') {
			rgbArray = rgbArray.trim();
			var newRGB;
			if (rgbArray.charAt(0) === '#')
				newRGB = AlphaColour.parseHTMLCode(rgbArray);
			else {
				const colorInfo = Colour.getColourInfoByName(rgbArray);
				if (!(colorInfo instanceof Array))
					throw new Error('Unrecognized colour name: ' + rgbArray);
				newRGB = [255, ...colorInfo];
			}
			rgbArray = newRGB;
		}
		else if (rgbArray instanceof Array && rgbArray.length === 3)
			rgbArray.unshift(255);

		if (rgbArray instanceof Array && rgbArray.length !== 4)
			throw new Error(`length must be 4 but got ${rgbArray.length}`);
		// if any change is really happening, update and dispatch the change event.
		if (this.rgbArray === undefined || this.rgbArray[0] !== rgbArray[0] ||
		this.rgbArray[1] !== rgbArray[1] || this.rgbArray[2] !== rgbArray[2] ||
		this.rgbArray[3] !== rgbArray[3]) {
			rgbArray = rgbArray.map((num) => clamp(Math.round(num), 0, 255));
			this.alpha = rgbArray[0];
			this.rgbArray = rgbArray.slice(1);
			this._dispatchEvent('change', {'colour': this});
		}
	}

	static canBeInterprettedAsAlphaColour(val) {
		if (typeof val === 'string')
			return AlphaColour.isValidColourString(val);
		if (val instanceof Array)
			return AlphaColour.isValidRGBArray(val);
		return Colour.canBeInterprettedAsColour(val);
	}

	static cloneColourOrAlphaColour(c) {
		if (c.alpha >= 255)
			return new Colour(c.rgbArray);
		else if (c instanceof Colour)
			return new Colour(c);
		else
			return new AlphaColour(c);
	}

	equals(otherColour) {
		if (otherColour instanceof Colour) {
			if (this.alpha !== 255)
				return false;
			return otherColour.to6DigitHTMLCode() === this.to6DigitHTMLCode();
		}
		else if (!(otherColour instanceof AlphaColour))
			return false;
		return this.to8DigitHTMLCode() === otherColour.to8DigitHTMLCode();
	}

	static getAsColour(c) {
		return new Colour(c.rgbArray);
	}

	/*
	Returns a value from 0 to 100.
	*/
	static getOpacityPercentage(c) {
		return c.alpha / 2.55;
	}

	static getOpacityRatio(c) {
		return c.alpha / 255;
	}

	static getRGBAExpression(c) {
		if (!(c instanceof AlphaColour))
			throw new Error(`c must be an AlphaColour but got ${c}`);
		return `rgba(${c.rgbArray.join(',')}, ${c.alpha / 255})`;
	}

	static getSanitizationTips(s) {
		const tips = Colour.getSanitizationTips(s);
		if (tips !== undefined)
			return tips;
		if (AlphaColour.isValidColourString('#' + s))
			return `Add # before your alphacolor code like "#${s}`;
	}

	isDark() {
		return new Colour(this.rgbArray).isDark();
	}

	static isOpaque(c) {
		return c.alpha >= 255;
	}

	static isTransparent(c) {
		return c.alpha === 0;
	}

	static isValidAlphaColourString(s) {
		if (s.charAt(0) === '#' && (s.length === 5 || s.length === 9)) {
			s = s.toLowerCase();
			for (let i = 1; i < s.length; i++) {
				const ch = s.charAt(i);
				if ((ch < '0' || ch > '9') && (ch < 'a' || ch > 'f'))
					return false;
			}
			return true;
		}
		return false;
	}

	static isValidColourString(s) {
		return Colour.isValidColourString(s) ||
			AlphaColour.isValidAlphaColourString(s);
	}

	static isValidRGBArray(val) {
		if (!(val instanceof Array))
			return false;
		else if (val.length < 3 || val.length > 4)
			return false;
		else
			for (let i = 0; i < val.length; i++) {
				if (!isNumber(val[i]))
					return false;
			}
		return true;
	}

	static parseHTMLCode(code) {
		if (Colour.isValidColourString(code))
			return [255, ...Colour.parseHTMLCode(code)];
		else if (AlphaColour.isValidAlphaColourString(code)) {
			code = code.substring(1);
			if (code.length === 4) {
				let convertedCode = '';
				for (let i = 0; i < 4; i++) {
					const c = code.charAt(i);
					convertedCode += c + c;
				}
				code = convertedCode;
			}
			if (code.length !== 8)
				throw new Error('HTML Colour code for argb must have 8 hex digits. Not: ' + code.length);
			const result = [];
			for (let i = 0; i < 4; i++) {
				const val = parseInt(code.substring(i * 2, i * 2 + 2), 16);
				if (isNaN(val))
					throw new Error('Unable to parse hex value from ' + code + '.  It appears to contain invalid hex digits.');
				result.push(val);
			}
			return result;
		}
	}

	toARGBArray() {
		return [this.alpha, ...this.rgbArray];
	}

	toArray() {
		return this.rgbArray.slice(0);
		// slice is used to prevent caller from mutating this AlphaColour.
	}

	to6DigitHTMLCode() {
		var result = '#';
		for (var i = 0; i < 3; i++)
			result += Colour.numTo2DigitHex(this.rgbArray[i]);
		return result;
	}

	to8DigitHTMLCode() {
		var result = '#' + Colour.numTo2DigitHex(this.alpha);
		for (var i = 0; i < 3; i++)
			result += Colour.numTo2DigitHex(this.rgbArray[i]);
		return result;
	}

	toString() {
		if (AlphaColour.isOpaque(this))
			return this.to6DigitHTMLCode();
		else
			return this.to8DigitHTMLCode();
	}
}