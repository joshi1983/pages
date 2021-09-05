import { processToken } from './processToken.js';
import { translateAssignStart } from './helpers/translateAssignStart.js';

export function processAssignment(token, result, options) {
	result.processCommentsUpToToken(token);
	const children = token.children;
	if (children.length === 2) {
		if (translateAssignStart(children[0], result, options)) {
			processToken(children[1], result, options);
			result.append('\n');
		}
	}
};