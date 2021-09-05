function getColour(x, y) {
	const r = Math.hypot(x, y);
	const red = Math.int((Math.sin(r) + 1) * 128);
	const green = Math.int((Math.sin(r / 10) + 1) * 128);
	const blue = Math.int((Math.sin(r / 100) + 1) * 128);
	return [red, green, blue];
}

function calculateColours(scale, left, top, width, height, outPixelData) {
	let index;
	for (let y = height - 1; y >= 0; y --) {
		index = y * width << 2;
		for (let x = width - 1; x >= 0; x --) {
			[red, green, blue] = getColour(left + x * scale, top + y * scale);
			outPixelData[index++] = red;
			outPixelData[index++] = green;
			outPixelData[index++] = blue;
			outPixelData[index++] = 255; // opaque alpha
		}
	}
}

onmessage = function(e) {
	if (e === null || typeof e !== 'object')
		throw new Error(`e expected to be a non-null object but got ${e}`);
	if (!(e.data instanceof Array))
		throw new Error(`e.data expected to be an Array but got ${e.data}`);
	const [scale, left, top, width, height] = e.data;
	if (!Number.isInteger(width) || width < 1)
		throw new Error(`width must be an integer of at least 1.  Not: ${width}`);
	if (!Number.isInteger(height) || height < 1)
		throw new Error(`height must be an integer of at least 1.  Not: ${height}`);
	if (isNaN(scale) || scale <= 0)
		throw new Error(`scale must be a number greater than 0.  Not: ${scale}`);
	if (isNaN(left) || left <= 0)
		throw new Error(`left must be a number greater than 0.  Not: ${left}`);
	if (isNaN(top) || top <= 0)
		throw new Error(`top must be a number greater than 0.  Not: ${top}`);

	const result = new ImageData(width, height);
	const outPixelData = result.data;
	calculateColours(scale, left, top, width, height, outPixelData);

	postMessage(result);
}