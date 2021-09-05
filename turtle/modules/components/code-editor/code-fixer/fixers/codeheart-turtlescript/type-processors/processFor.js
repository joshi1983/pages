import { isSimpleForLoop } from './for-loops/isSimpleForLoop.js';
import { processForSimple } from './for-loops/processForSimple.js';
import { processForToWhile } from './for-loops/processForToWhile.js';
import { processToken } from './processToken.js';

export function processFor(token, result) {
	result.processCommentsUpToToken(token);
	const codeBlock = token.children[1];
	if (isSimpleForLoop(token)) {
		processForSimple(token, result);
		result.append(' ');
		if (codeBlock === undefined)
			result.append('[\n]');
		else
			processToken(codeBlock, result);
	}
	else
		processForToWhile(token, result);
};