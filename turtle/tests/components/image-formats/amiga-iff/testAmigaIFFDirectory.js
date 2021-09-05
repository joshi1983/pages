import { testGetPaletteColours } from './testGetPaletteColours.js';
import { testIsPossibleMatch } from './testIsPossibleMatch.js';
import { testPaletteColoursToBitsPerPixel } from './testPaletteColoursToBitsPerPixel.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testAmigaIFFDirectory(logger) {
	wrapAndCall([
		testGetPaletteColours,
		testIsPossibleMatch,
		testPaletteColoursToBitsPerPixel
	], logger);
};