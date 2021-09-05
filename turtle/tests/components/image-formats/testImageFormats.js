import { testBitmap } from './testBitmap.js';
import { testBitmapDirectory } from './bitmap/testBitmapDirectory.js';
import { testPCX } from './testPCX.js';
import { testPCXDirectory } from './pcx/testPCXDirectory.js';
import { testPPM } from './testPPM.js';
import { testPPMDirectory } from './ppm/testPPMDirectory.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testImageFormats(logger) {
	wrapAndCall([
		testBitmap,
		testBitmapDirectory,
		testPCX,
		testPCXDirectory,
		testPPM,
		testPPMDirectory
	], logger);
};