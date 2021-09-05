/*
The formula for lightness is explained at:
https://en.wikipedia.org/wiki/HSL_and_HSV
*/
export function getLightness(colour) {
	const rgbArray = colour.rgbArray;
	return (Math.max(rgbArray[0], rgbArray[1], rgbArray[2]) + Math.min(rgbArray[0], rgbArray[1], rgbArray[2])) * 0.5;
};