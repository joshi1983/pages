import { testIsLikelyJai } from
'./testIsLikelyJai.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

export function testJai(logger) {
	wrapAndCall([
		testIsLikelyJai
	], logger);
};