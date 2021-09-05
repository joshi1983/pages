import { testShouldTranslateToIf } from './testShouldTranslateToIf.js';
import { testShouldTranslateToNothing } from './testShouldTranslateToNothing.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testIf(logger) {
	wrapAndCall([
		testShouldTranslateToIf,
		testShouldTranslateToNothing
	], logger);
};