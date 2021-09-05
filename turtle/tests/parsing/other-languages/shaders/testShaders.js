import { testGLSL } from './glsl/testGLSL.js';
import { testHLSL } from './hlsl/testHLSL.js';
import { testWGSL } from './wgsl/testWGSL.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testShaders(logger) {
	wrapAndCall([
		testGLSL,
		testHLSL,
		testWGSL
	], logger);
};