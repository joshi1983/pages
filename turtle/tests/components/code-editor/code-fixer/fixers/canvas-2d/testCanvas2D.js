import { testIsLikelyCanvas2D } from
'./testIsLikelyCanvas2D.js';
import { testTranslate } from
'./testTranslate.js';
import { testTypeProcessors } from './type-processors/testTypeProcessors.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testCanvas2D(logger) {
	wrapAndCall([
		testIsLikelyCanvas2D,
		testTranslate,
		testTypeProcessors
	], logger);
};