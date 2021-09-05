import { testDecode } from './testDecode.js';
import { testGetPixelColours } from './testGetPixelColours.js';
import { testUses256ColourPalette } from './testUses256ColourPalette.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testPCXDirectory(logger) {
	wrapAndCall([
		testDecode,
		testGetPixelColours,
		testUses256ColourPalette,
	], logger);
};