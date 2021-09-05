import { testGetPixelStartByteIndex } from './testGetPixelStartByteIndex.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testPPMDirectory(logger) {
	wrapAndCall([
		testGetPixelStartByteIndex
	], logger);
};