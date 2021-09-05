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

export async function processFilesBasic(cases, unit, logger) {
	const name = unit.constructor.name;
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
		}
		catch (e) {
			console.error(e);
			plogger(`Error or exception thrown while processing test. message=${exceptionToString(e)}`);
		}
	}
};