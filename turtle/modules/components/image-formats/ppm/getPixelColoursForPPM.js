import { clamp } from '../../../clamp.js';
import { getPixelValuesForBinary } from
'./getPixelValuesForBinary.js';
import { getValuesFromString } from './getValuesFromString.js';
const decoder = new TextDecoder();

function byteArrayToString(byteArray) {
	return decoder.decode(byteArray);
}

function echoValue(val) {
	return val;
}

function invertValue(val) {
	return 255 - val;
}

export function getPixelColoursForPPM(pixelDataByteArray, width, height, maxValue, version) {
	const result = [];
	let values;
	if (version === 6 || version === 4) {
		values = getPixelValuesForBinary(pixelDataByteArray, maxValue, width);
	}
	else {
		values = getValuesFromString(byteArrayToString(pixelDataByteArray), maxValue).map(function(val) {
			if (isNaN(val))
				return val;

			return clamp(val * 255 / maxValue, 0, 255);
		});
	}
	let convertValue = echoValue;
	if (version === 1)
		convertValue = invertValue;
	const valuesPerPixel = Math.round(values.length / (width * height));
	for (let y = 0; y < height; y++) {
		const row = [];
		const rowStartIndex = y * width * valuesPerPixel;
		for (let x = 0; x < width; x++) {
			const index = rowStartIndex + x * valuesPerPixel;
			let red, green, blue;
			if (valuesPerPixel === 3) {
				red = convertValue(values[index]);
				green = convertValue(values[index + 1]);
				blue = convertValue(values[index + 2]);
			}
			else {
				red = green = blue = convertValue(values[index]);
			}
			row.push([red, green, blue, 255]);
		}
		result.push(row);
	}
	return result;
};