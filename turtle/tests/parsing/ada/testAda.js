import { testIsLikelyAda } from
'./testIsLikelyAda.js';
import { wrapAndCall } from
'../../helpers/wrapAndCall.js';

export function testAda(logger) {
	wrapAndCall([
		testIsLikelyAda
	], logger);
};