import { PPM } from
'../../../modules/components/image-formats/PPM.js';
import { processFilesBasic } from './processFilesBasic.js';

export function testPPM(logger) {
	const cases = [
		{
			'filename': 'image-formats/ppm/blackAndWhiteP1File.ppm',
			'width': 24, 'height': 7,
			'version': 1,
			'pixelDataStartIndex': 39,
			'maxValue': 1,
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#fff'},
				{'x': 0, 'y': 6, 'colour': '#fff'},
				{'x': 23, 'y': 6, 'colour': '#000'},
			]
		},
		{
			'filename': 'image-formats/ppm/colorP3File.ppm',
			'width': 4, 'height': 4,
			'version': 3,
			'pixelDataStartIndex': 146,
			'maxValue': 15,
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#000'},
				{'x': 1, 'y': 1, 'colour': '#0f7'},
				{'x': 0, 'y': 3, 'colour': '#f0f'},
				{'x': 3, 'y': 3, 'colour': '#000'},
			]
		},
		{
			'filename': 'image-formats/ppm/colorP3FileOnePixelPerLine.ppm',
			'width': 4, 'height': 4,
			'version': 3,
			'pixelDataStartIndex': 140,
			'maxValue': 15,
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#000'},
				{'x': 1, 'y': 1, 'colour': '#0f7'},
				{'x': 0, 'y': 3, 'colour': '#f0f'},
				{'x': 3, 'y': 3, 'colour': '#000'},
			]
		},
		{
			'filename': 'image-formats/ppm/colorP6File.ppm',
			'width': 4, 'height': 4,
			'version': 6,
			'pixelDataStartIndex': 51,
			'maxValue': 255,
			'pixelChecks': [
				// Loading colorP6File.ppm with GIMP 2.10.4
				// has pixel 0, 0 as #0A2020.
				// GIMP might be buggy for this case, though.
				// It looks like GIMP is calculating the pixel data start index 1 byte off.
				// GIMP might have been tested with \n character as a delimiter when \r\n is also possible
				// and \r\n is used to break lines in colorP6File.ppm.
				{'x': 0, 'y': 0, 'colour': '#202020'},

				{'x': 1, 'y': 0, 'colour': '#202020'},
				{'x': 2, 'y': 0, 'colour': '#202020'},
				{'x': 3, 'y': 3, 'colour': '#efbfbd'}
			]
		},
		{
			'filename': 'image-formats/ppm/feep.ppm',
			'width': 4, 'height': 4,
			'version': 3,
			'pixelDataStartIndex': 25,
			'maxValue': 15,
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#000'},
				{'x': 1, 'y': 1, 'colour': '#0f7'},
				{'x': 0, 'y': 3, 'colour': '#f0f'},
				{'x': 3, 'y': 3, 'colour': '#000'},
			]
		},
		{
			'filename': 'image-formats/ppm/feep2P.ppm',
			'width': 24, 'height': 7,
			'version': 2,
			'pixelDataStartIndex': 39,
			'maxValue': 15,
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#000'},
				{'x': 1, 'y': 1, 'colour': '#333'},
				{'x': 23, 'y': 0, 'colour': '#000'},
				{'x': 22, 'y': 1, 'colour': '#fff'}
			]
		},
		{
			'filename': 'image-formats/ppm/jP1.ppm',
			'width': 6, 'height': 10,
			'maxValue': 1,
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#fff'},
				{'x': 3, 'y': 0, 'colour': '#fff'},
				{'x': 4, 'y': 0, 'colour': '#000'},
				{'x': 5, 'y': 0, 'colour': '#fff'},
				{'x': 5, 'y': 9, 'colour': '#fff'}
			]
		},
		{
			'filename': 'image-formats/ppm/jP4.ppm',
			'version': 4,
			'width': 6, 'height': 10,
			'maxValue': 1,
			'pixelDataStartIndex': 99,
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#fff'},
				{'x': 3, 'y': 0, 'colour': '#fff'},
				{'x': 4, 'y': 0, 'colour': '#000'},
				{'x': 5, 'y': 0, 'colour': '#fff'},
				{'x': 5, 'y': 9, 'colour': '#fff'}
			]
		},
		{
			'filename': 'image-formats/ppm/jP6.ppm',
			'version': 6,
			'width': 6, 'height': 10,
			'maxValue': 255,
			'pixelDataStartIndex': 104,
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#fff'},
				{'x': 3, 'y': 0, 'colour': '#fff'},
				{'x': 4, 'y': 0, 'colour': '#000'},
				{'x': 5, 'y': 0, 'colour': '#fff'},
				{'x': 5, 'y': 9, 'colour': '#fff'}
			]
		},
		{
			'filename': 'image-formats/ppm/jP6-single-line-break-character.ppm',
			'version': 6,
			'width': 6, 'height': 10,
			'maxValue': 255,
			'pixelDataStartIndex': 100,
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#fff'},
				{'x': 3, 'y': 0, 'colour': '#fff'},
				{'x': 4, 'y': 0, 'colour': '#000'},
				{'x': 5, 'y': 0, 'colour': '#fff'},
				{'x': 5, 'y': 9, 'colour': '#fff'}
			]
		},
		{
			'filename': 'image-formats/ppm/one-by-one.ppm',
			'width': 1, 'height': 1,
			'version': 6,
			'pixelDataStartIndex': 12,
			'maxValue': 255,
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#EFBFBD'}
			]
		},
	];
	processFilesBasic(cases, PPM, logger, undefined,
		undefined, undefined);
};