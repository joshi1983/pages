import { testCompositeFixer } from './testCompositeFixer.js';
import { testIsLikelyPapert } from './testIsLikelyPapert.js';
import { wrapAndCall } from '../../../../../helpers/wrapAndCall.js';

export function testPapert(logger) {
	wrapAndCall([
		testCompositeFixer,
		testIsLikelyPapert
	], logger);
};