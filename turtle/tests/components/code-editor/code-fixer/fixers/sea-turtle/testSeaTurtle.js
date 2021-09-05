import { testIsLikelySeaTurtle } from './testIsLikelySeaTurtle.js';
import { testScanning } from './scanning/testScanning.js';
import { testSeaTurtleColours } from './testSeaTurtleColours.js';
import { testSeaTurtleCommands } from './testSeaTurtleCommands.js';
import { testTranslationToWebLogo } from './translation-to-weblogo/testTranslationToWebLogo.js';
import { wrapAndCall } from '../../../../../helpers/wrapAndCall.js';

export function testSeaTurtle(logger) {
	wrapAndCall([
		testIsLikelySeaTurtle,
		testScanning,
		testSeaTurtleColours,
		testSeaTurtleCommands,
		testTranslationToWebLogo
	], logger);
};