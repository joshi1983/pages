/*
colour could be Colour or AlphaColour.
The caller should verify that colour is never the Transparent object.
*/
export function ColourToRGBRatios(colour) {
	const rgb = colour.rgbArray;
	const red = rgb[0] / 255;
	const green = rgb[1] / 255;
	const blue = rgb[2] / 255;
	return red + ' ' + green + ' ' + blue;
};