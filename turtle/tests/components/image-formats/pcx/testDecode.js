import { decode } from
'../../../../modules/components/image-formats/pcx/decode.js';
import { duplicate } from
'../../../../modules/command-groups/helpers/duplicate.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testDecode(logger) {
	const cases = [
		{'inArgs': [[0xc2, 1], 0, 1, 1, 1, 1, 1],
		'out': [1, 1]},
		{'inArgs': [[0xc2, 1, 9], 0, 1, 1, 1, 1, 1],
		'out': [1, 1]},

		{'inArgs': [[0, 0, 0], 0, 1, 1, 8, 3, 1],
		'out': [0, 0, 0]}, // similar to data in black-single-pixel.pcx

		{'inArgs': [[1, 0xc1, 0xff, 2, 0, 3, 0], 0, 2, 1, 8, 3, 1],
		'out': [1, 0xff, 2, 0, 3, 0]},
		{'inArgs': [[1, 0xc1, 0xff, 2, 0, 3, 0, 0,
		0xc1, 0xfe, 0xc2, 0, 0xc2, 0, 0], 0, 2, 2, 8, 3, 1],
		'out': [1, 0xff, 2, 0, 3, 0,
		0, 0xfe, 0, 0, 0, 0]},
		{'inArgs': [[0xf4, 0xff], 0, 34, 1, 1, 4, 1],
		'out': duplicate(0xff, 52)},
	];
	cases.forEach(function(caseInfo) {
		if (caseInfo.inArgs.length < 8) {
			const width = caseInfo.inArgs[2];
			const bitsPerPlane = caseInfo.inArgs[4];
			let bytesPerLine = Math.ceil(width * bitsPerPlane / 8);
			caseInfo.inArgs.push(bytesPerLine);
		}
	});
	testInOutPairs(cases, decode, logger);
};