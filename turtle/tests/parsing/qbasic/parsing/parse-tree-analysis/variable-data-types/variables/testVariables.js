import { testGetAnalyzedVariables } from './testGetAnalyzedVariables.js';
import { wrapAndCall } from
'../../../../../../helpers/wrapAndCall.js';

export function testVariables(logger) {
	wrapAndCall([
		testGetAnalyzedVariables
	], logger);
};