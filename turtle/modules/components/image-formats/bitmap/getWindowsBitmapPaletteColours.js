
// Returns an Array of Array.
// Each Array element represents a colour as a 4-element Array of the format: 
// [red, green, blue, alpha].
// red, gree, blue, alpha ranges 0..255.
export function getWindowsBitmapPaletteColours(byteArray, paletteStartOffset, paletteLength) {
	if (!Number.isInteger(paletteStartOffset))
		throw new Error(`paletteStartOffset must be an integer but found ${paletteStartOffset}`);
	const result = [];
	for (let i = 0; i < paletteLength; i++) {
		const index = paletteStartOffset + i * 4;
		const blue = byteArray[index];
		const green = byteArray[index + 1];
		const red = byteArray[index + 2];
		let alpha = byteArray[index + 3];
		alpha = 255; // assume palette colours are opaque in general.
		result.push([red, green, blue, alpha]);
	}
	return result;
};