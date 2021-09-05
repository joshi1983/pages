import { getColourStringFromToken } from './getColourStringFromToken.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { processToken } from '../processToken.js';
import { SonicWebTurtleColor } from '../../../SonicWebTurtleColor.js';

function isVariableReferenceNotColorName(token) {
	if (token.type !== ParseTreeTokenType.VARIABLE_REFERENCE)
		return false;
	const colorHex = SonicWebTurtleColor.nameToHex(token.val);
	return colorHex === undefined;
}

export function color(token, result, settings) {
	if (token.children.length === 1) {
		const child = token.children[0];
		if (child.val.length > 1 &&
		(child.val.startsWith('-') || child.val.startsWith('+'))) {
			result.append('\nwebTurtleOffsetColor ');
			if (child.val.startsWith('+'))
				result.append(child.val.substring(1));
			else
				result.append(child.val);
		}
		else if (isVariableReferenceNotColorName(child)) {
			result.append('\nwebTurtleColor ');
			processToken(child, result, settings);
		}
		else {
			result.append('\nsetPenColor ');
			const stringLiteralVal = getColourStringFromToken(child);
			if (stringLiteralVal !== undefined) {
				result.append('"' + stringLiteralVal);
			}
			else {
				processToken(child, result, settings);
			}
		}
	}
	else {
		result.append(`; Unable to translate color call.\n`);
		result.append(`; 1 parameter expected but found ${token.children.length}\n`);
	}
};