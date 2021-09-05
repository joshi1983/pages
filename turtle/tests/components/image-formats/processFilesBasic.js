import { AlphaColour } from
'../../../modules/AlphaColour.js';
import { blobToArrayBuffer } from
'../../../modules/blobToArrayBuffer.js';
import { exceptionToString } from
'../../../modules/exceptionToString.js';
import { fetchBlob } from
'../../../modules/fetchBlob.js';
import { getPixelColour } from './getPixelColour.js';
import { getPixelColours } from
'../../../modules/components/image-formats/pcx/getPixelColours.js';
import { prefixWrapper } from
'../../helpers/prefixWrapper.js';
import { ProgressIndicator } from '../../helpers/ProgressIndicator.js';
import { sleep } from '../../helpers/sleep.js';

export async function processFilesBasic(cases, unit, logger, getPaletteColours, getPixelColours, decode) {
	const name = unit.constructor.name;
	const progressIndicator = new ProgressIndicator(`test${unit.name}`);
	logger.indicators.push(progressIndicator);

	for (let index = 0; index < cases.length; index++) {
		const caseInfo = cases[index];
		const plogger = prefixWrapper(`Case ${index}, filename=${caseInfo.filename}`, logger);
		try {
			const url = 'tests/data/' + caseInfo.filename;
			const arrayBuffer = await blobToArrayBuffer(await fetchBlob(url));
			const isMatch = unit.isPossibleMatch(new Uint8Array(arrayBuffer));
			if (isMatch !== true)
				plogger(`Expected ${name}.isPossibleMatch to return true but found ${isMatch}`);
			else {
				const imageBitmap = await unit.arrayBufferToImageBitmap(arrayBuffer);
				if (!(imageBitmap instanceof ImageBitmap))
					plogger(`Expected an ImageBitmap but found ${imageBitmap}`);
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
			const meta = unit.getMeta(byteArray);
			if (typeof meta !== 'object')
				plogger(`Expected getMeta to return an object but found ${meta}`);
			else {
				const keysToCheck = ['bitsPerPixel', 'bitsPerPlane', 'bytesPerLine', 'height',
				'maxValue', 'paletteStartOffset', 'pixelDataStartIndex', 'version', 'width'];
				for (const keyToCheck of keysToCheck) {
					if (caseInfo[keyToCheck] !== undefined && caseInfo[keyToCheck] !== meta[keyToCheck])
						plogger(`Expected ${keyToCheck} to be ${caseInfo[keyToCheck]} but found ${meta[keyToCheck]}`);
				}
			}
			if (typeof getPaletteColours === 'function') {
				if (typeof meta === 'object') {
					const palette = getPaletteColours(byteArray, meta.paletteStartOffset, meta.paletteLength);
					if (caseInfo.paletteLength !== undefined && palette.length !== caseInfo.paletteLength) {
						plogger(`Expected colour palette length to be ${caseInfo.paletteLength} but found ${palette.length}`);
					}
					if (decode !== undefined) {
						const decodedPixelData = decode(byteArray, meta.pixelDataStartIndex,
	meta.width, meta.height, meta.bitsPerPlane, meta.numberOfColorPlanes, meta.encoding, meta.bytesPerLine);
						const pixels = getPixelColours(decodedPixelData, palette, meta.width, meta.height,
							meta.bitsPerPlane, meta.numberOfColorPlanes, meta.bytesPerLine);
						if (!(pixels instanceof Array))
							plogger(`getPixelColours must return an Array but found ${pixels}`);

						if (caseInfo.paletteChecks !== undefined) {
							caseInfo.paletteChecks.forEach(function(paletteCheck, checkIndex) {
								const [r,g,b, alpha] = palette[paletteCheck.index];
								const c = new AlphaColour(r,g,b);
								const expected = new AlphaColour(paletteCheck.colour);
								if (!c.equals(expected)) {
									plogger(`Palette index ${paletteCheck.index}, check index ${checkIndex}, expected ${paletteCheck.colour} but found ${c.toString()}`);
								}
							});
						}
					}
				}
			}
			else if (caseInfo.paletteChecks !== undefined || caseInfo.paletteLength !== undefined)
				plogger(`getPaletteChecks must be specified if any case specifies paletteChecks or paletteLength`);
		}
		catch (e) {
			console.error(e);
			plogger(`Error or exception thrown while processing test. message=${exceptionToString(e)}`);
		}
		await sleep(100);
		progressIndicator.setProgressRatio(index / cases.length);
	}
	progressIndicator.completed();
};