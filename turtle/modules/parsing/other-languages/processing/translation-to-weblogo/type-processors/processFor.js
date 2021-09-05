import { processTokens } from './helpers/processTokens.js';
import { shouldBeTranslatableToFor } from './for-loops/shouldBeTranslatableToFor.js';
import { shouldTranslateToRepeat } from './for-loops/shouldTranslateToRepeat.js';
import { shouldBeTranslatableToWhile } from './for-loops/shouldBeTranslatableToWhile.js';
import { translateForToRepeat } from './for-loops/translateForToRepeat.js';
import { translateProcessingForToWebLogoFor } from './for-loops/translateProcessingForToWebLogoFor.js';
import { translateProcessingForToWebLogoWhile } from './for-loops/translateProcessingForToWebLogoWhile.js';

export function processFor(token, result, settings) {
	result.processCommentsUpToToken(token);
	if (shouldTranslateToRepeat(token))
		translateForToRepeat(token, result, settings);
	else if (shouldBeTranslatableToFor(token))
		translateProcessingForToWebLogoFor(token, result, settings);
	else if (shouldBeTranslatableToWhile(token))
		translateProcessingForToWebLogoWhile(token, result, settings);
	else {
		result.append(`\n; FIXME: manual translation needed with a for-loop\n`);
		result.append('\nfor ');
		processTokens(token.children, result, settings);
	}
};