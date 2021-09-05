import { AlphaColour } from
'../../../modules/AlphaColour.js';
import { blobToArrayBuffer } from
'../../../modules/blobToArrayBuffer.js';
import { decode } from
'../../../modules/components/image-formats/pcx/decode.js';
import { exceptionToString } from
'../../../modules/exceptionToString.js';
import { fetchBlob } from
'../../../modules/fetchBlob.js';
import { getPaletteColours } from
'../../../modules/components/image-formats/pcx/getPaletteColours.js';
import { getPixelColours } from
'../../../modules/components/image-formats/pcx/getPixelColours.js';
import { PCX } from
'../../../modules/components/image-formats/PCX.js';
import { prefixWrapper } from
'../../helpers/prefixWrapper.js';
import { processFilesBasic } from './processFilesBasic.js';
import { wrapAndCall } from
'../../helpers/wrapAndCall.js';
await AlphaColour.asyncInit();

async function testWithFiles(logger) {
	const cases = [
		{'filename': 'format-classification/test.pcx',
			'width': 2, 'height': 13
		},
		{
			'filename': 'image-formats/pcx/16col.pcx',
			'width': 872, 'height': 436,
			'paletteLength': 16,
			'paletteChecks': [
				{'index': 0, 'colour': '#0d1710'},
				{'index': 1, 'colour': '#fffaf9'},
				{'index': 2, 'colour': '#fa4e43'},
				{'index': 3, 'colour': '#728aa6'},
			],
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#728aa6'},
			]
		},
		{
			'filename': 'image-formats/pcx/animals.pcx',
			'width': 239, 'height': 157,
			'paletteLength': 8,
			'paletteChecks': [
				{'index': 0, 'colour': '#1026D1'},
				{'index': 3, 'colour': '#ff1026'},
			],
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#260000'},
				{'x': 100, 'y': 0, 'colour': '#260000'},
				{'x': 230, 'y': 0, 'colour': '#260000'},
				{'x': 231, 'y': 0, 'colour': '#260000'},
				{'x': 232, 'y': 0, 'colour': '#260000'},
				{'x': 0, 'y': 15, 'colour': '#260000'},
			]
		},
		{
			'filename': 'image-formats/pcx/black-single-pixel.pcx',
			'width': 1, 'height': 1,
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#000'},
			]
		},
		{
			'filename': 'image-formats/pcx/CGA_BW.PCX',
			'width': 640, 'height': 200,
			'paletteLength': 2,
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#000'}
			]
		},
		{
			'filename': 'image-formats/pcx/CGA_RGBI.PCX',
			'width': 320, 'height': 200,
			'paletteLength': 4
		},
		{
			'filename': 'image-formats/pcx/CGA_TST1.PCX',
			'width': 320, 'height': 200,
			'paletteLength': 4
		},
		{'filename': 'image-formats/pcx/clown.pcx',
			'paletteLength': 256,
			'width': 320, 'height': 200
		},
		{
			'filename': 'image-formats/pcx/DRACULA.PCX',
			'width': 88, 'height': 52,
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#fff'}
			]
		},
		{
			'filename': 'image-formats/pcx/FACE.PCX',
			'width': 268, 'height': 378,
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#fff'},
				{'x': 0, 'y': 1, 'colour': '#fff'},
				{'x': 0, 'y': 2, 'colour': '#fff'},
			]
		},
		{
			'filename': 'image-formats/pcx/lena10.pcx',
			'width': 512, 'height': 512,
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#ba82a7'},
				{'x': 4, 'y': 0, 'colour': '#ec9b41'}
			]
		},
		{'filename': 'image-formats/pcx/parrot.pcx',
			'width': 150, 'height': 200
		},
		{
			'filename': 'image-formats/pcx/parrot-grayscale.pcx',
			'width': 150, 'height': 200,
			'paletteLength': 256,
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#000'},
				{'x': 1, 'y': 0, 'colour': '#000'},
			]
		},
		{
			'filename': 'image-formats/pcx/parrot-tiny.pcx',
			'width': 46, 'height': 53
		},
		{
			'filename': 'image-formats/pcx/red-single-pixel.pcx',
			'width': 1, 'height': 1,
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#f00'},
			]
		},
		{'filename': 'image-formats/pcx/shuttle1.pcx',
			'width': 94, 'height': 33,
			'paletteLength': 16,
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#14733f'},
				{'x': 2, 'y': 1, 'colour': '#031905'},
				{'x': 5, 'y': 17, 'colour': '#02147c'}
			]
		},{
			'filename': 'image-formats/pcx/thimbleweed.pcx',
			'width': 872, 'height': 436,
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#5e95af'},
				{'x': 1, 'y': 0, 'colour': '#639db8'},
				{'x': 0, 'y': 214, 'colour': '#634c6e'},
				{'x': 0, 'y': 435, 'colour': '#2a1c26'}
			]
		},{
			'filename': 'image-formats/pcx/three-by-3.pcx',
			'width': 3, 'height': 3,
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#fff'},
				{'x': 1, 'y': 0, 'colour': '#fff'},
				{'x': 2, 'y': 0, 'colour': '#000'},
				{'x': 0, 'y': 1, 'colour': '#fff'},
				{'x': 1, 'y': 1, 'colour': '#fff'},
				{'x': 2, 'y': 1, 'colour': '#000'}
			]
		},
		{
			'filename': 'image-formats/pcx/vertical-strip.pcx',
			'width': 2, 'height': 11,
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#010203'},
				{'x': 1, 'y': 0, 'colour': '#f00'},
				{'x': 0, 'y': 1, 'colour': '#000'},
				{'x': 1, 'y': 1, 'colour': '#fe0000'},
			]
		},{
			'filename': 'image-formats/pcx/vertical-strip-monochrome.pcx',
			'width': 2, 'height': 7,
			'paletteLength': 2,
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#fff'},
				{'x': 0, 'y': 3, 'colour': '#fff'},
				{'x': 1, 'y': 0, 'colour': '#000'},
				{'x': 0, 'y': 4, 'colour': '#fff'},
				{'x': 1, 'y': 4, 'colour': '#fff'},
			]
		},
	];
	processFilesBasic(cases, PCX, logger, getPaletteColours, getPixelColours, decode);
	for (let index = 0; index < cases.length; index++) {
		const caseInfo = cases[index];
		const plogger = prefixWrapper(`Case ${index}, filename=${caseInfo.filename}`, logger);
		try {
			const url = 'tests/data/' + caseInfo.filename;
			const arrayBuffer = await blobToArrayBuffer(await fetchBlob(url));
			const imageBitmap = await PCX.arrayBufferToImageBitmap(arrayBuffer);
			if (!(imageBitmap instanceof ImageBitmap))
				plogger(`Expected an ImageBitmap but found ${imageBitmap}`);
			const byteArray = new Uint8Array(arrayBuffer);
			const meta = PCX.getMeta(byteArray);
			if (typeof meta === 'object') {
				const decodedPixelData = decode(byteArray, 128, meta.width, meta.height, meta.bitsPerPlane, 
				meta.numberOfColorPlanes, meta.encoding, meta.bytesPerLine);
				const palette = getPaletteColours(byteArray);
				const pixels = getPixelColours(decodedPixelData, palette, meta.width, meta.height,
	meta.bitsPerPlane, meta.numberOfColorPlanes, meta.bytesPerLine);
				if (pixels.length !== meta.height)
					plogger(`Expected getPixelColours to return an Array with length ${meta.height} but found ${pixels.length}`);
			}
		}
		catch (e) {
			console.error(e);
			plogger(`Error or exception thrown while processing test. message=${exceptionToString(e)}`);
		}
	}
}

export function testPCX(logger) {
	wrapAndCall([
		testWithFiles
	], logger);
};