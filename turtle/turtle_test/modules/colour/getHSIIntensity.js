/*
The formula for intensity is explained at:
https://en.wikipedia.org/wiki/HSL_and_HSV
*/
export function getHSIIntensity(colour) {
	const rgbArray = colour.rgbArray;
	return (rgbArray[0] + rgbArray[1] + rgbArray[2]) / 3;
};