import { testTranslateSpecialCommandCall } from
'./testTranslateSpecialCommandCall.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testCommands(logger) {
	wrapAndCall([
		testTranslateSpecialCommandCall
	], logger);
};