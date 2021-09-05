import { getPixelColoursForPPM } from './ppm/getPixelColoursForPPM.js';
import { getPixelStartByteIndex } from './ppm/getPixelStartByteIndex.js';
import { mightBeMaxValue } from './ppm/mightBeMaxValue.js';
import { pixelColoursToImageBitmap } from './pixelColoursToImageBitmap.js';

export class PPM {
	static getMeta(byteArray) {
		const s = new TextDecoder().decode(byteArray);
		const lines = s.split('\n').map(line => line.trim()).filter(line => line[0] !== '#' && line !== '');
		const firstLine = lines[0];
		const firstLineTokens = firstLine.split(/\s+/);
		const versionNumber = parseFloat(firstLineTokens[0].substring(1));
		const secondLine = lines[1];
		let maxValue = 255;
		if (versionNumber === 1 || versionNumber === 4)
			maxValue = 1;
		let width, height;
		if (firstLineTokens.length >= 3) {
			width = parseInt(firstLineTokens[1].trim());
			height = parseInt(firstLineTokens[2].trim());
			if (firstLineTokens.length > 3 && mightBeMaxValue(firstLineTokens[3]))
				maxValue = parseInt(firstLineTokens[3].trim());
		}
		else if (secondLine !== undefined) {
			const secondLineTokens = secondLine.split(/\s+/);
			if (secondLineTokens.length === 2) {
				[width, height] = secondLineTokens.map(s => parseInt(s.trim()));
			}
			const thirdLine = lines[2];
			if (mightBeMaxValue(thirdLine)) {
				const maxVal1 = parseInt(thirdLine);
				if (!isNaN(maxVal1))
					maxValue = maxVal1;
			}
		}
		const pixelDataStartIndex = getPixelStartByteIndex(s, byteArray, width * height, versionNumber);
		return {
			'version': versionNumber,
			'pixelDataStartIndex': pixelDataStartIndex,
			'maxValue': maxValue,
			'width': width,
			'height': height
		};
	}

	static isPossibleMatch(byteArray) {
		// A PPM file must start with P and a base-10 digit like
		// P1, P3, P6
		if (byteArray[0] !== 'P'.charCodeAt(0))
			return false;

		const secondByte = byteArray[1];
		if (secondByte < '0'.charCodeAt(0) || secondByte > '9'.charCodeAt(0))
			return false;
		const meta = PPM.getMeta(byteArray);
		if (!Number.isInteger(meta.width) || !Number.isInteger(meta.height) ||
		!Number.isInteger(meta.maxValue) || meta.maxValue >= 65536 || meta.maxValue < 1)
			return false;
		if (isNaN(meta.version))
			return false;

		return true;
	}

	static arrayBufferToImageBitmap(arrayBuffer) {
		const byteArray = new Uint8Array(arrayBuffer);
		const meta = PPM.getMeta(byteArray);
		const pixelColours = getPixelColoursForPPM(byteArray.subarray(meta.pixelDataStartIndex),
			meta.width, meta.height, meta.maxValue, meta.version);
		return pixelColoursToImageBitmap(pixelColours, meta.width, meta.height);
	}
};