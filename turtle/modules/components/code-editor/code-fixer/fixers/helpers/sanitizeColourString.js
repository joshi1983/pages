import { AlphaColour } from '../../../../../AlphaColour.js';
import { Colour } from '../../../../../Colour.js';

function removeLeadingPoundSigns(s) {
	let i = 0;
	for (; s[i] === '#' && i < s.length; i++) {
	}
	return s.substring(i);
}

export function sanitizeColourString(s) {
	s = s.trim().replace(/"/g, '');
	s = removeLeadingPoundSigns(s).replace(/#/g, '');
	if (Colour.isValidHTMLColourCode(s))
		return s;
	if (AlphaColour.isValidAlphaColourString(s))
		return s;
	if (Colour.isValidHTMLColourCode('#' + s))
		return '#' + s;
	if (AlphaColour.isValidAlphaColourString('#' + s))
		return '#' + s;
	return s;
};