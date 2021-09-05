import { testPerspectiveTransformer } from './testPerspectiveTransformer.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testTransformers(logger) {
	wrapAndCall([
		testPerspectiveTransformer
	], logger);
};