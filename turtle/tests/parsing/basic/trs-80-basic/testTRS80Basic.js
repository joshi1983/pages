import { testIsLikelyTRS80Basic } from
'./testIsLikelyTRS80Basic.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

export function testTRS80Basic(logger) {
	wrapAndCall([
		testIsLikelyTRS80Basic
	], logger);
};