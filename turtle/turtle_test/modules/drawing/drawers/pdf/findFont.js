import { longestCommonSubsequence } from '../../../longestCommonSubsequence.js';
const symbolFontNames = new Set([
	'symbol', 'zapfdingbats',
]);

class FontMatch {
	constructor(name, defaultStyle) {
		this.name = name;
		this.defaultStyle = defaultStyle;
	}
};

function avoidSymbolFonts(strings) {
	const nonSymbols = strings.filter(s => !symbolFontNames.has(s.toLowerCase()));
	if (nonSymbols.length > 0)
		return nonSymbols;
	else
		return strings;
}

function getCloseMatches(strings, string) {
	if (strings.length <= 1)
		return strings;
	let maxLen = -1, result = [];
	for (let i = 0; i < strings.length; i++) {
		const other = strings[i];
		const len = longestCommonSubsequence(other.toLowerCase(), string);
		if (len > maxLen) {
			maxLen = len;
			result = [other];
		}
		else if (len === maxLen)
			result.push(other);
	}
	if (result.length > 1)
		result = avoidSymbolFonts(result);
	return result;
}

function getDefaultStyle(styles) {
	if (!(styles instanceof Array))
		throw new Error('styles expected to be an Array but got ' + styles);
	let shortest;
	for (let i = 0; i < styles.length; i++) {
		const s = styles[i];
		if (s === '' || s.toLowerCase() === 'normal') {
			return s; // '' or 'normal' are good default styles.
		}
		else if (shortest === undefined || shortest.length < s.length) {
			shortest = s;
		}
	}
	return shortest; // if '' or 'normal' are not found, return the shortest style.
}

export function findFont(fonts, fontName) {
	if (typeof fonts !== 'object')
		throw new Error('fonts expected to be an object but got ' + fonts);
	if (typeof fontName !== 'string')
		throw new Error('fontName must be a string.  Not: ' + fontName);

	// if exact match found,
	if (fonts[fontName] !== undefined)
		return new FontMatch(fontName, getDefaultStyle(fonts[fontName]));
	// if almost exact match(only case is different),
	if (fonts[fontName.toLowerCase()] !== undefined)
		return new FontMatch(fontName.toLowerCase(), getDefaultStyle(fonts[fontName.toLowerCase()]));

	// find most similar font name.
	fontName = fontName.toLowerCase();
	const keys = new Set(Object.keys(fonts));
	const keysArray = Object.keys(fonts).
		filter(k => !keys.has(k.toLowerCase()) || k.toLowerCase() !== k).
		filter(k => !symbolFontNames.has(k.toLowerCase()));
	const closeMatches = getCloseMatches(keysArray, fontName);
	if (closeMatches.length === 0)
		return undefined;
	const font = fonts[closeMatches[0]];
	return new FontMatch(closeMatches[0], getDefaultStyle(font));
};