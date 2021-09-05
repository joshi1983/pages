import { getDescendentsOfType } from '../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const penDrawingCommandNames = new Set(['draw']);

function isPenNeedingCommand(commandToken) {
	return penDrawingCommandNames.has(commandToken.val.toLowerCase());
}

export function processPenStyle(root, result, settings) {
	if (getDescendentsOfType(root, ParseTreeTokenType.COMMAND).some(isPenNeedingCommand)) {
		result.append('\nsetLineJoinStyle "round\n');
	}
};