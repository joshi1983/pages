import { findFont } from './findFont.js';
import { Transparent } from '../../../Transparent.js';

export function setFont(doc, style) {
	const c = style.getFillColor();
	if (c !== Transparent) {
		doc.setTextColor(c.rgbArray[0], c.rgbArray[1], c.rgbArray[2]);
	}
	doc.setFontSize(72 * style.getFontSize());
	const fonts = doc.getFontList();
	const fontName = style.getFontFamily();
	const closestMatch = findFont(fonts, fontName);
	if (closestMatch !== undefined)
		doc.setFont(closestMatch.name, closestMatch.defaultStyle);
};