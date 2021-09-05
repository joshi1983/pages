import { clamp } from '../../../clamp.js';
import { formatNumber } from '../../../formatNumber.js';

function roundTo3Digits(num) {
	return formatNumber(num, 3);
}

function formatRatio(byteVal) {
	return roundTo3Digits(clamp(byteVal / 255, 0, 1));
}

export function formatColorRatios(colour) {
	return colour.rgbArray.map(formatRatio).join(' ');
};