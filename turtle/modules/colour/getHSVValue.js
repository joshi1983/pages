export function getHSVValue(colour) {
	return Math.max(colour.rgbArray[0], colour.rgbArray[1], colour.rgbArray[2]);
};