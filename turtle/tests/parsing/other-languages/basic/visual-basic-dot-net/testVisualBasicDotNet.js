import { testIsLikelyVisualBasicDotNet } from
'./testIsLikelyVisualBasicDotNet.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testVisualBasicDotNet(logger) {
	wrapAndCall([
		testIsLikelyVisualBasicDotNet
	], logger);
};