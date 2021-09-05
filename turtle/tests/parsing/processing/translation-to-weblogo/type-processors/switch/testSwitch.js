import { testGetSwitchValueName } from './testGetSwitchValueName.js';
import { testShouldSwitchValueBeStoredInVariable } from './testShouldSwitchValueBeStoredInVariable.js';
import { testShouldTranslateToDefaultOnly } from './testShouldTranslateToDefaultOnly.js';
import { testShouldTranslateToIf } from './testShouldTranslateToIf.js';
import { testShouldTranslateToNothing } from './testShouldTranslateToNothing.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testSwitch(logger) {
	wrapAndCall([
		testGetSwitchValueName,
		testShouldSwitchValueBeStoredInVariable,
		testShouldTranslateToDefaultOnly,
		testShouldTranslateToIf,
		testShouldTranslateToNothing,
	], logger);
};