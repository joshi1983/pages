import { getDescendentsOfType } from
'../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

function isPaletteCallOfInterest(call) {
	const children = call.children;
	if (children.length !== 2)
		return false;

	const nameToken = children[0];
	if (nameToken.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	if (nameToken.val.toLowerCase() !== 'palette')
		return false;

	const argList = children[1].children;
	return argList.length === 3;
}

export function needsQBPalette_2(tree) {
	// is a colour read anywhere?
	// if no, return false.
	

	const paletteCalls = getDescendentsOfType(tree, ParseTreeTokenType.FUNCTION_CALL).
		filter(isPaletteCallOfInterest);
	if (paletteCalls.length !== 0)
		return true;

	return false;
};