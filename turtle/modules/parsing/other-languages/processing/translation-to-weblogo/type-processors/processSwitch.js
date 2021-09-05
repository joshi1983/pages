import { processSwitchDefaultsOnly } from './switch/processSwitchDefaultsOnly.js';
import { processSwitchToIf } from './switch/processSwitchToIf.js';
import { processSwitchToIfElse } from './switch/processSwitchToIfElse.js';
import { shouldTranslateToDefaultOnly } from './switch/shouldTranslateToDefaultOnly.js';
import { shouldTranslateToNothing } from './switch/shouldTranslateToNothing.js';
import { shouldTranslateToIf } from './switch/shouldTranslateToIf.js';

export function processSwitch(token, result, settings) {
	result.processCommentsUpToToken(token);
	if (shouldTranslateToNothing(token))
		return;

	if (shouldTranslateToIf(token))
		processSwitchToIf(token, result, settings);
	else if (shouldTranslateToDefaultOnly(token))
		processSwitchDefaultsOnly(token, result, settings);
	else {
		processSwitchToIfElse(token, result, settings);
	}
};