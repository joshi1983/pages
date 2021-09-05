import { getDescendentsOfType } from '../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function isClockRead(token) {
	if (token.val !== 'clock')
		return false;
	return true;
}

export function processClock(root, result) {
	if (getDescendentsOfType(root, ParseTreeTokenType.IDENTIFIER).some(isClockRead)) {
		result.append('\nmake "clock animation.time\n');
	}
};