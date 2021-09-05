import { processProcessingIfToWebLogoIf } from './if/processProcessingIfToWebLogoIf.js';
import { processProcessingIfToWebLogoIfelse } from './if/processProcessingIfToWebLogoIfelse.js';
import { shouldTranslateToNothing } from './if/shouldTranslateToNothing.js';
import { shouldTranslateToIf } from './if/shouldTranslateToIf.js';

export function processIf(token, result, settings) {
	result.processCommentsUpToToken(token);
	if (shouldTranslateToNothing(token))
		return;

	if (shouldTranslateToIf(token))
		processProcessingIfToWebLogoIf(token, result, settings);
	else {
		processProcessingIfToWebLogoIfelse(token, result, settings);
	}
};