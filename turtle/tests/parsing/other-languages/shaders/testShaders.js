import { testGLSL } from './glsl/testGLSL.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testShaders(logger) {
	wrapAndCall([
		testGLSL
	], logger);
};