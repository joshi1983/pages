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
import { wrapAndCall } from
'../../helpers/wrapAndCall.js';
await AlphaColour.asyncInit();

function getPixelColour(imageBitmap, x, y) {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Set canvas dimensions to match the ImageBitmap
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;

    // Draw the ImageBitmap onto the canvas
    context.drawImage(imageBitmap, 0, 0);

    // Get the pixel data at the specified coordinates
    const imageData = context.getImageData(x, y, 1, 1).data;

    // Extract RGBA values
    const [r, g, b, a] = imageData;

    return new AlphaColour(a, r, g, b);
}

async function testWithFiles(logger) {
	const cases = [
		{
			'filename': 'image-formats/16col.pcx',
			'width': 872, 'height': 436,
			'paletteLength': 16,
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#728aa6'},
			]
		},
		{
			'filename': 'image-formats/black-single-pixel.pcx',
			'width': 1, 'height': 1,
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#000'},
			]
		},
		{
			'filename': 'image-formats/CGA_BW.PCX',
			'width': 640, 'height': 200,
			'paletteLength': 2,
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#000'}
			]
		},
		{'filename': 'image-formats/clown.pcx',
			'width': 320, 'height': 200
		},
		{
			'filename': 'image-formats/DRACULA.PCX',
			'width': 88, 'height': 52,
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#fff'}
			]
		},
		{
			'filename': 'image-formats/FACE.PCX',
			'width': 268, 'height': 378,
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#fff'},
				//{'x': 0, 'y': 1, 'colour': '#fff'},
				{'x': 0, 'y': 2, 'colour': '#fff'},
			]
		},
		{'filename': 'image-formats/parrot.pcx',
			'width': 150, 'height': 200
		},
		{
			'filename': 'image-formats/parrot-grayscale.pcx',
			'width': 150, 'height': 200,
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#000'},
				{'x': 1, 'y': 0, 'colour': '#000'},
			]
		},
		{
			'filename': 'image-formats/parrot-grayscale-monochrome.pcx',
			'paletteLength': 2,
			'width': 150, 'height': 200
		},
		{
			'filename': 'image-formats/parrot-tiny.pcx',
			'width': 46, 'height': 53
		},
		{
			'filename': 'image-formats/red-single-pixel.pcx',
			'width': 1, 'height': 1,
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#f00'},
			]
		},
		{'filename': 'format-classification/test.pcx',
			'width': 2, 'height': 13
		},{
			'filename': 'image-formats/thimbleweed.pcx',
			'width': 872, 'height': 436
		},{
			'filename': 'image-formats/three-by-3.pcx',
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
			'filename': 'image-formats/vertical-strip.pcx',
			'width': 2, 'height': 11,
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#010203'},
				{'x': 1, 'y': 0, 'colour': '#f00'},
				{'x': 0, 'y': 1, 'colour': '#000'},
				{'x': 1, 'y': 1, 'colour': '#fe0000'},
			]
		},{
			'filename': 'image-formats/vertical-strip-monochrome.pcx',
			'width': 2, 'height': 7,
			'paletteLength': 2,
			'pixelChecks': [
				{'x': 0, 'y': 0, 'colour': '#fff'},
				{'x': 0, 'y': 3, 'colour': '#fff'},
				{'x': 1, 'y': 0, 'colour': '#000'},
				{'x': 0, 'y': 4, 'colour': '#fff'},
				//{'x': 1, 'y': 4, 'colour': '#fff'},
			]
		},
	];
	for (let index = 0; index < cases.length; index++) {
		const caseInfo = cases[index];
		const plogger = prefixWrapper(`Case ${index}, filename=${caseInfo.filename}`, logger);
		try {
			const url = 'tests/data/' + caseInfo.filename;
			const arrayBuffer = await blobToArrayBuffer(await fetchBlob(url));
			const isMatch = PCX.isPossibleMatch(new Uint8Array(arrayBuffer));
			if (isMatch !== true)
				plogger(`Expected true but found ${isMatch}`);
			const imageBitmap = await PCX.arrayBufferToImageBitmap(arrayBuffer);
			if (!(imageBitmap instanceof ImageBitmap))
				plogger(`Expected an ImageBitmap but found ${imageBitmap}`);
			else {
				if (imageBitmap.width !== caseInfo.width)
					plogger(`Expected width to be ${caseInfo.width} but found ${imageBitmap.width}`);
				if (imageBitmap.height !== caseInfo.height)
					plogger(`Expected height to be ${caseInfo.height} but found ${imageBitmap.height}`);
				if (caseInfo.pixelChecks !== undefined) {
					caseInfo.pixelChecks.forEach(function(pixelCheck, pixelIndex) {
						const pixelColour = getPixelColour(imageBitmap, pixelCheck.x, pixelCheck.y);
						const pixelLogger = prefixWrapper(`Pixel check ${pixelIndex}, x=${pixelCheck.x}, y=${pixelCheck.y}`, plogger);
						if (pixelColour === undefined ||
						!pixelColour.equals(new AlphaColour(pixelCheck.colour)))
							pixelLogger(`Expected ${pixelCheck.colour} but found ${pixelColour}`);
					});
				}
			}
			const byteArray = new Uint8Array(arrayBuffer);
			const palette = getPaletteColours(byteArray);
			if (caseInfo.paletteLength !== undefined && palette.length !== caseInfo.paletteLength) {
				plogger(`Expected colour palette length to be ${caseInfo.paletteLength} but found ${palette.length}`);
			}
			const meta = PCX.getMeta(byteArray);
			if (typeof meta !== 'object')
				plogger(`Expected getMeta to return an object but found ${meta}`);
			else {
				const decodedPixelData = decode(byteArray, 128, meta.width, meta.height, meta.bitsPerPlane, 
				meta.numberOfColorPlanes, meta.encoding, meta.bytesPerLine);
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