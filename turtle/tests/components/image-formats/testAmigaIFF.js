import { AmigaIFF } from
'../../../modules/components/image-formats/AmigaIFF.js';
import { processFilesBasic } from './processFilesBasic.js';

export function testAmigaIFF(logger) {
	const cases = [
		{
			'filename': 'image-formats/iff/single-white-pixel.iff',
			'width': 1, 'height': 1,
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#fff'},
			]
		},
		{
			'filename': 'image-formats/iff/single-red-pixel.iff',
			'width': 1, 'height': 1,
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#f00'},
			]
		},
		{
			'filename': 'image-formats/iff/single-green-pixel.iff',
			'width': 1, 'height': 1,
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#0f0'},
			]
		},
		{
			'filename': 'image-formats/iff/single-blue-pixel.iff',
			'width': 1, 'height': 1,
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#00f'},
			]
		}
		{
			'filename': 'image-formats/iff/2-by-2-black-white-red-blue.iff',
			'width': 2, 'height': 2,
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#000'},
				{'x': 1, 'y': 0, 'colour': '#fff'},
				{'x': 0, 'y': 1, 'colour': '#f00'},
				{'x': 1, 'y': 1, 'colour': '#00f'},
			]
		}
	];
	processFilesBasic(cases, AmigaIFF, logger, undefined,
		undefined, undefined);
};