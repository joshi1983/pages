import { AlphaColour } from
'../../../../../AlphaColour.js';
import { Colour } from
'../../../../../Colour.js';
import { isNumber } from
'../../../../../isNumber.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';
import { processToken } from '../processToken.js';

/*
For now, we're assuming the default color settings are used.
- color mode is the default RGB.  Not HSB.
- The maximum value for gray is 255.
Not some arbitrary number set with functions like color_mode.
*/

function processOne(colorToken, result, settings) {
	let val = colorToken.val;
	if (colorToken.type === ParseTreeTokenType.NUMBER_LITERAL) {
		val = val.toLowerCase();
		if (val.startsWith('0x'))
			result.append(`"#${val.substring(2)}`);
		else if (val[0] === '#')
			result.append('"' + val);
		else {
			val = Math.max(0, Math.round(parseFloat(val)));
			if (val <= 255) // interpret as a gray value.
				result.append(new Colour(val, val, val).to6DigitHTMLCode());
			else {
				let str = val.toString(16);
				if (str.length <= 6)
					str = '0'.repeat(6 - str.length) + str;
				else if (str.length < 8)
					str = '0'.repeat(8 - str.length) + str;
				result.append(`"#${str}`);
			}
		}
	}
	else
		processToken(colorToken, result, settings);
}

function processTwo(argTokens, result, settings) {
	const tokenValues = settings.cachedParseTree.getTokenValues();
	const rgbGrayValue = tokenValues.get(argTokens[0]);
	const alpha = tokenValues.get(argTokens[1]);
	if (isNumber(alpha) && isNumber(rgbGrayValue)) {
		result.append(' "');
		if (rgbGrayValue <= 255) // assume gray
			result.append(new AlphaColour(alpha, rgbGrayValue, rgbGrayValue, rgbGrayValue).toString());
		else {
			result.append(new AlphaColour(alpha, (rgbGrayValue >> 16) & 0xff,
				(rgbGrayValue >> 8) & 0xff, rgbGrayValue & 0xff).toString());
		}
	}
	else if (isNumber(rgbGrayValue)) {
		result.append(' mix "');
		if (rgbGrayValue <= 255) // assume gray
			result.append(new Colour(rgbGrayValue, rgbGrayValue, rgbGrayValue).to6DigitHTMLCode());
		else
			result.append(new Colour((rgbGrayValue >> 16) & 0xff,
				(rgbGrayValue >> 8) & 0xff, rgbGrayValue & 0xff).to6DigitHTMLCode());
		result.append(' ');
		processToken(argTokens[1], result, settings);
		result.append(' / 255 ');
	}
	else {
		result.append(' [ ');
		for (let tok of argTokens) {
			processToken(tok, result, settings);
			result.append(' ');
		}
		result.append(' ] ');
	}
}

function processThree(argTokens, result, settings) {
	let vals = [];
	const tokenValues = settings.cachedParseTree.getTokenValues();
	for (const arg of argTokens) {
		const val = tokenValues.get(arg);
		if (isNumber(val))
			vals.push(val);
	}
	if (vals.length === 3) {
		result.append(new Colour(vals[0], vals[1], vals[2]).to6DigitHTMLCode());
	}
	else {
		result.append(' [ ');
		for (const arg of argTokens) {
			processToken(arg, result, settings);
			result.append(' ');
		}
		result.append(' ] ');
	}
}

export function processArgumentsAsSingleColor(argTokens, result, settings) {
	if (argTokens.length === 1) {
		processOne(argTokens[0], result, settings);
	}
	else if (argTokens.length === 2)
		processTwo(argTokens, result, settings);
	else if (argTokens.length === 3)
		processThree(argTokens, result, settings);
	else {
		result.append(`; Unable to translate arguments to a single color expression in WebLogo\n`);
		for (const arg of argTokens) {
			processToken(arg, result, settings);
			result.append(' ');
		}
	}
};