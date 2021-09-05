import { getPixelColours } from
'../../../../modules/components/image-formats/pcx/getPixelColours.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testGetPixelColours(logger) {
	const cases = [
		{'inArgs': [[0, 0, 0], [], 1, 1, 8, 3],
		'out': [[[0, 0, 0, 255]]]}, // similar to data in black-single-pixel.pcx

		{'inArgs': [[1], [[0, 0, 0, 255], [255, 255, 255, 255]], 1, 1, 8, 1],
		'out': [[[255, 255, 255, 255]]]},
		{'inArgs': [[0], [[0, 0, 0, 255], [255, 255, 255, 255]], 1, 1, 8, 1],
		'out': [[[0, 0, 0, 255]]]},
		{'inArgs': [[0x40, 0],
		[[0, 0, 0, 255], [255, 255, 255, 255]], 2, 1, 2, 1],
		'out': [[[255, 255, 255, 255], [0, 0, 0, 255]]]},
		{'inArgs': [[1, 0xff, 2, 0, 3, 0], [], 2, 1, 8, 3],
		'out': [[[1, 2, 3, 255], [0xff, 0, 0, 255]]]
		},
		{
			'inArgs': [
			[1, 0xff, 2, 0, 3, 0,
		0, 0xfe, 0, 0, 0, 0],
		[], 2, 2, 8, 3
		],
			'out': [
			[[1, 2, 3, 255], [0xff, 0, 0, 255]],
			[[0, 0, 0, 255], [0xfe, 0, 0, 255]]
		]
		}
	];
	cases.forEach(function(caseInfo) {
		const width = caseInfo.inArgs[2];
		const bitsPerChannel = caseInfo.inArgs[4];
		let bytesPerLine = Math.ceil(width * bitsPerChannel / 8);
		caseInfo.inArgs.push(bytesPerLine);
	});
	testInOutPairs(cases, getPixelColours, logger);
};