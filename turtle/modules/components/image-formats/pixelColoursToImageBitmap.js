export function pixelColoursToImageBitmap(pixelColours, width, height) {
	if (!(pixelColours instanceof Array))
		throw new Error(`pixelColours must be an Array but found ${pixelColours}`);
	if (!Number.isInteger(width))
		throw new Error(`width must be an integer but found ${width}`);
	if (!Number.isInteger(height))
		throw new Error(`height must be an integer but found ${height}`);
	if (pixelColours.length < height)
		throw new Error(`pixelColours.length must be at least height(${height}) but found pixelColours.length=${pixelColours.length}`);

	const arr = new Uint8ClampedArray(4 * width * height);
	// set pixel data to use a constant colour of red.
	for (let y = 0; y < height; y++) {
		const rowPixels = pixelColours[y];
		for (let x = 0; x < width; x++) {
			const pixelColour = rowPixels[x];
			if (pixelColour === undefined)
				continue;
			const index = (y * width + x) * 4;
			arr[index] = pixelColour[0]; // red
			arr[index + 1] = pixelColour[1]; // green
			arr[index + 2] = pixelColour[2]; // blue
			arr[index + 3] = pixelColour[3]; // alpha
		}
	}
	const imageData = new ImageData(arr, width, height);

	const result = createImageBitmap(imageData, 0, 0, width, height);
	return result;
};