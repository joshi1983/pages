import { Colour } from '../../../../../Colour.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { SonicWebTurtleColor } from '../../../SonicWebTurtleColor.js';
await Colour.asyncInit();

const colorsData = SonicWebTurtleColor.getAllColoursData();
const supportedTokenTypes = new Set([
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.STRING_LITERAL,
	ParseTreeTokenType.VARIABLE_REFERENCE
]);

export function getColourStringFromToken(token) {
	if (!supportedTokenTypes.has(token.type))
		return;
	let val = token.val;
	if (!isNaN(val)) {
		val = Math.max(0, Math.floor(parseFloat(val)) % colorsData.length);
		const color = colorsData[val];
		return color.hex;
	}
	else {
		let hex = SonicWebTurtleColor.nameToHex(val);
		if (hex !== undefined) {
			if (SonicWebTurtleColor.isUniqueToSonicWebTurtle(val))
				return hex;
		}
		if (hex === undefined && token.type === ParseTreeTokenType.VARIABLE_REFERENCE)
			return;
		const colourInfo = Colour.getColourInfoByName(val);
		if (colourInfo !== undefined)
			return val;
	}
};