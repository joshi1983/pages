import { Bitmap } from
'../../../modules/components/image-formats/Bitmap.js';
import { decodePixelDataForWindowsBitmap } from
'../../../modules/components/image-formats/bitmap/decodePixelDataForWindowsBitmap.js';
import { getWindowsBitmapPaletteColours } from
'../../../modules/components/image-formats/bitmap/getWindowsBitmapPaletteColours.js';
import { getPixelColoursForWindowsBitmap } from
'../../../modules/components/image-formats/bitmap/getPixelColoursForWindowsBitmap.js';
import { processFilesBasic } from './processFilesBasic.js';
import { wrapAndCall } from
'../../helpers/wrapAndCall.js';

async function testWithFiles(logger) {
	const cases = [
		{'filename': 'image-formats/bitmap/all_gray.bmp',
		'width': 8, 'height': 2,
		'pixelChecks': [
			{'x': 0, 'y': 0, 'colour': '#878787'},
			{'x': 7, 'y': 1, 'colour': '#878787'}
		]},
		{'filename': 'image-formats/bitmap/chessboard-4px-color-16bit.bmp',
		'bitsPerPixel': 16,
		'width': 4, 'height': 4,
		'pixelChecks': [
			{'x': 0, 'y': 0, 'colour': '#fff'},
			{'x': 1, 'y': 0, 'colour': '#000'},
			{'x': 2, 'y': 0, 'colour': '#fff'},
			{'x': 1, 'y': 1, 'colour': '#f00'},
			{'x': 3, 'y': 1, 'colour': '#0f0'},
			{'x': 2, 'y': 2, 'colour': '#00f'},
		]},
		{'filename': 'image-formats/bitmap/chessboard-16px-1bit.bmp',
		'bytesPerLine': 4,
		'paletteLength': 2,
		'paletteChecks': [
			{'index': 0, 'colour': '#000'},
			{'index': 1, 'colour': '#fff'},
		],
		'width': 16, 'height': 16,
		'pixelChecks': [
			{'x': 0, 'y': 0, 'colour': '#fff'},
			{'x': 1, 'y': 0, 'colour': '#fff'},
			{'x': 0, 'y': 1, 'colour': '#fff'},
			{'x': 0, 'y': 2, 'colour': '#000'},
			{'x': 0, 'y': 3, 'colour': '#000'}
		]
		},
		{'filename': 'image-formats/bitmap/gradient-4-by-4.bmp',
			'width': 4, 'height': 4,
			'paletteLength': 0,
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#967a3a'},
				{'x': 3, 'y': 0, 'colour': '#9ed850'},
				{'x': 0, 'y': 3, 'colour': '#925732'}
			]
		},
		{
			'filename': 'image-formats/bitmap/JUR_OS2_small.bmp',
			'width': 203, 'height': 142,
			'paletteLength': 4,
			'paletteChecks': [
				{'index': 0, 'colour': '#000'},
				{'index': 1, 'colour': '#fc0040'},
				{'index': 2, 'colour': '#fcfcfc'},
				{'index': 3, 'colour': '#fcfc00'},
			],
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#fc0040'},
				{'x': 0, 'y': 118, 'colour': '#000'},
				{'x': 0, 'y': 141, 'colour': '#fcfcfc'}
			]
		},
		{
			'filename': 'image-formats/bitmap/JUR_OS2_small_rle.bmp',
			'width': 203, 'height': 142,
			'bitsPerPixel': 4,
			'paletteLength': 4,
			'paletteChecks': [
				{'index': 0, 'colour': '#000'},
				{'index': 1, 'colour': '#fc0040'},
				{'index': 2, 'colour': '#fcfcfc'},
				{'index': 3, 'colour': '#fcfc00'},
			],
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#fc0040'},
				{'x': 0, 'y': 141, 'colour': '#fcfcfc'}
			]
		},
		{
			'filename': 'image-formats/bitmap/mostlyclear.bmp',
			'width': 128, 'height': 128,
			'paletteLength': 256,
			'paletteChecks': [
				{'index': 0, 'colour': '#000'},
				{'index': 1, 'colour': '#800000'},
				{'index': 0x2f, 'colour': '#e0a000'}
			],
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#000'},
				{'x': 45, 'y': 114, 'colour': '#fff'},
				{'x': 70, 'y': 15, 'colour': '#e0a000'}
			]
		},
		{
			'filename': 'image-formats/bitmap/pal8os2v2-16.bmp',
			'width': 127, 'height': 64,
			'paletteLength': 256,
			'paletteChecks': [
				{'index': 0, 'colour': '#000'},
				{'index': 1, 'colour': '#300'},
				{'index': 2, 'colour': '#600'}
			],
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#f00'},
				{'x': 0, 'y': 63, 'colour': '#000'}
			]
		},
		{'filename': 'image-formats/bitmap/square-4px-1bit.bmp',
			'width': 4, 'height': 4,
			'paletteStartOffset': 0x7A,
			'paletteChecks': [
				{'index': 0, 'colour': '#000'},
				{'index': 1, 'colour': '#fff'},
			],
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#fff'},
				{'x': 1, 'y': 0, 'colour': '#000'},
				{'x': 0, 'y': 1, 'colour': '#fff'},
				{'x': 0, 'y': 2, 'colour': '#fff'},
				{'x': 0, 'y': 3, 'colour': '#000'},
			]
		},
		{'filename': 'image-formats/bitmap/square-8-by-8.bmp',
			'width': 8, 'height': 8,
			'paletteLength': 256,
			'pixelChecks': [
				{'x': 0, 'y': 7, 'colour': '#000'},
				{'x': 0, 'y': 0, 'colour': '#040404'}
			]
		},
		{'filename': 'image-formats/bitmap/square-8-by-8-rle.bmp',
			'width': 8, 'height': 8,
			'paletteLength': 256,
			'pixelChecks': [
				{'x': 0, 'y': 7, 'colour': '#000'},
			]
		},
		{'filename': 'image-formats/bitmap/square-black.bmp',
			'width': 1, 'height': 1,
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#000'},
			]
		},
		{'filename': 'image-formats/bitmap/square-blue.bmp',
			'width': 1, 'height': 1,
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#00f'},
			]
		},
		{'filename': 'image-formats/bitmap/square-green.bmp',
			'width': 1, 'height': 1,
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#0f0'},
			]
		},
		{'filename': 'image-formats/bitmap/square-red.bmp',
			'width': 1, 'height': 1,
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#f00'},
			]
		},
	];
	processFilesBasic(cases, Bitmap, logger, getWindowsBitmapPaletteColours,
		getPixelColoursForWindowsBitmap, decodePixelDataForWindowsBitmap);
}

export function testBitmap(logger) {
	wrapAndCall([
		testWithFiles
	], logger);
};