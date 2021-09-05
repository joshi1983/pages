import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { uses256ColourPalette } from
'../../../../modules/components/image-formats/pcx/uses256ColourPalette.js';

export function testUses256ColourPalette(logger) {
	// these cases are from a table of PCX image formats at:
	// https://en.wikipedia.org/wiki/PCX
	const cases = [
		{'inArgs': [4, 1], 'out': false},
		{'inArgs': [8, 1], 'out': true},
		{'inArgs': [4, 4], 'out': false},
		{'inArgs': [8, 3], 'out': false},
		{'inArgs': [8, 4], 'out': false},
		{'inArgs': [1, 1], 'out': false},
		{'inArgs': [1, 4], 'out': false}
	];
	testInOutPairs(cases, uses256ColourPalette, logger);
};