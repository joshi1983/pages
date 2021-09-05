import { Colour } from
'../../../../modules/Colour.js';
import { paletteColoursToBitsPerPixel } from
'../../../../modules/components/image-formats/amiga-iff/paletteColoursToBitsPerPixel.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testPaletteColoursToBitsPerPixel(logger) {
	const cases = [
		{'in': undefined, 'out': 24},
		{'in': 256, 'out': 8},
		{'in': 128, 'out': 7},
		{'in': 64, 'out': 6},
		{'in': 32, 'out': 5},
		{'in': 17, 'out': 5}, // 17 is very unlikely but we still want 5 as output.
		{'in': 16, 'out': 4},
		{'in': 2, 'out': 1},

		// now a couple weird inputs but we still don't want an exception thrown or any problems.
		{'in': 1, 'out': 1},
		{'in': 0, 'out': 1}
	];
	cases.forEach(function(caseInfo) {
		if (Number.isInteger(caseInfo.in)) {
			const array = [];
			for (let i = 0; i < caseInfo.in; i++) {
				array.push(new Colour(0, 0, 0));
			}
			caseInfo.in = array;
		}
	});
	testInOutPairs(cases, paletteColoursToBitsPerPixel, logger);
};