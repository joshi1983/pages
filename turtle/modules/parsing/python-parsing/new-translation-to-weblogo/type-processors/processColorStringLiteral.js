import { Colour } from '../../../../Colour.js';
import { Colours } from '../../Colours.js';
import { getStringLiteralValue } from
'../../parse-tree-analysis/variable-data-types/evaluators/getStringLiteralValue.js';
import { stringValueToWebLogoStringLiteral } from '../../../generic-parsing-utilities/stringValueToWebLogoStringLiteral.js';
await Colour.asyncInit();

function colourStringToWebLogoEquivalent(pyColorString) {
	if (pyColorString.startsWith('#'))
		return pyColorString;
	const hex = Colours.nameToHex(pyColorString.toLowerCase());
	if (hex === undefined)
		return pyColorString;
	if (!Colour.isValidColourString(pyColorString))
		return hex;
	const webLogoNameColour = new Colour(pyColorString);
	const webLogoHex = webLogoNameColour.to6DigitHTMLCode();
	if (webLogoHex !== hex)
		return hex;
	return pyColorString;
}

export function processColorStringLiteral(stringToken, result) {
	const translatedStringValue = colourStringToWebLogoEquivalent(getStringLiteralValue(stringToken));
	result.append(stringValueToWebLogoStringLiteral(translatedStringValue));
};