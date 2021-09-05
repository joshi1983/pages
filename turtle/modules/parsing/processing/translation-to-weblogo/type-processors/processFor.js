import { processTokens } from './helpers/processTokens.js';
import { shouldTranslateToRepeat } from './for-loops/shouldTranslateToRepeat.js';
import { translateForToRepeat } from './for-loops/translateForToRepeat.js';

export function processFor(token, result, settings) {
	result.processCommentsUpToToken(token);
	if (shouldTranslateToRepeat(token))
		translateForToRepeat(token, result, settings);
	else {
		result.append(`\n; FIXME: manual translation needed with a for-loop\n`);
		result.append('\nfor ');
		processTokens(token.children, result, settings);
	}
};