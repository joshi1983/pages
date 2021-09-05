import { isSimpleForLoop } from './for-loops/isSimpleForLoop.js';
import { processForSimple } from './for-loops/processForSimple.js';
import { processForToWhile } from './for-loops/processForToWhile.js';

export function processFor(processToken) {
	if (typeof processToken !== 'function')
		throw new Error(`processToken must be a function but got ${processToken}`);
	return function(token, result, settings) {
		result.processCommentsUpToToken(token);
		const codeBlock = token.children[1];
		if (isSimpleForLoop(token)) {
			processForSimple(token, result);
			result.append(' ');
			if (codeBlock === undefined)
				result.append('[\n]');
			else
				processToken(codeBlock, result, settings);
		}
		else
			processForToWhile(processToken, token, result, settings);
	};
};