import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { testPerspectiveTransformer } from './testPerspectiveTransformer.js';

export function testTransformers(logger) {
	testPerspectiveTransformer(prefixWrapper('testPerspectiveTransformer', logger));
};