function processDownscaleArbitraryScale(scaleFactor, inWidth, inHeight, inPixelData, outPixelData) {
	const outWidth = Math.floor(inWidth / scaleFactor);
	const outHeight = Math.floor(inHeight / scaleFactor);
	const scaleFactorInverseSquared = 1 / (scaleFactor * scaleFactor);
	for (let y = scaleFactor * Math.floor((inHeight - 1) / scaleFactor); y >= 0; y -= scaleFactor ) {
		for (let x = scaleFactor * Math.floor((inWidth - 1) / scaleFactor); x >= 0; x -= scaleFactor) {
			let red = 0, green = 0, blue = 0, alpha = 0, numNotTransparent = 0;
			for (let i = 0; i < scaleFactor; i++) {
				for (let j = 0; j < scaleFactor; j++) {
					let di = ((y + i) * inWidth + x + j + 1) << 2;
					const individualAlpha = inPixelData[--di];
					if (individualAlpha !== 0) {
						blue += inPixelData[--di];
						green += inPixelData[--di];
						red += inPixelData[--di];
						numNotTransparent++;
						alpha += individualAlpha;
					}
				}
			}
			let i = Math.floor((y * outWidth + x) * 4 / scaleFactor);
			if (alpha === 0)
				outPixelData[i + 3] = 0;
			else {
				outPixelData[i] = red / numNotTransparent;
				outPixelData[++i] = green / numNotTransparent;
				outPixelData[++i] = blue / numNotTransparent;
				outPixelData[++i] = alpha * scaleFactorInverseSquared;
			}
		}
	}
}

onmessage = function(e) {
	const [scaleFactor, imageData] = e.data;
	if (!Number.isInteger(scaleFactor) || scaleFactor < 2)
		throw new Error(`scaleFactor must either be an integer of at least 2.  Not: ${scaleFactor}`);
	const inPixelData = imageData.data;
	const inWidth = imageData.width;
	const inHeight = imageData.height;
	const outWidth = Math.floor(inWidth / scaleFactor);
	const outHeight = Math.floor(inHeight / scaleFactor);
	if (!(inPixelData instanceof Uint8ClampedArray))
		throw new Error(`Uint8ClampedArray expected but got ${inPixelData}`);

	const result = new ImageData(outWidth, outHeight);
	const outPixelData = result.data;
	processDownscaleArbitraryScale(scaleFactor, inWidth, inHeight, inPixelData, outPixelData);

	postMessage(result);
}