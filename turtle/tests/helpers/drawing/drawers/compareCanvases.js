export function compareCanvases(canvas1, canvas2, pixelGap) {
	if (canvas1.width !== canvas2.width)
		throw new Error(`Expected width to be equal.  canvas1.width=${canvas1.width}, canvas2.width=${canvas2.width}`);
	if (canvas1.height !== canvas2.height)
		throw new Error(`Expected height to be equal.  canvas1.height=${canvas1.height}, canvas2.height=${canvas2.height}`);
	if (!Number.isInteger(canvas1.width))
		throw new Error(`Expected canvas1.width to be an integer but got ${canvas1.width}`);
	if (!Number.isInteger(canvas1.height))
		throw new Error(`Expected canvas1.height to be an integer but got ${canvas1.height}`);
	if (!(canvas1 instanceof Element))
		throw new Error(`Expected canvas1 to be an Element but got ${canvas1}`);
	if (!(canvas2 instanceof Element))
		throw new Error(`Expected canvas2 to be an Element but got ${canvas2}`);
	if (pixelGap === undefined)
		pixelGap = 1;
	else if (!Number.isInteger(pixelGap) || pixelGap < 1)
		throw new Error(`pixelGap must be an integer at least 1 but got ${pixelGap}`);
	const w = Math.round(canvas1.width);
	const h = Math.round(canvas1.height);
	const context1 = canvas1.getContext('2d');
	const context2 = canvas2.getContext('2d');
	const data1 = context1.getImageData(0, 0, w, h).data;
	const data2 = context2.getImageData(0, 0, w, h).data;
	let diff = 0;
	const pixelsCounted = 255 * 3 * Math.floor(h / pixelGap) * Math.floor(w / pixelGap);
	for (let y = 0; y < h; y += pixelGap) {
		const index1 = y * w * 4;
		for (let x = 0; x < w; x += pixelGap) {
			let index = index1 + (x << 2);
			diff += Math.abs(data1[index] - data2[index]);
			index++;
			diff += Math.abs(data1[index] - data2[index]);
			index++;
			diff += Math.abs(data1[index] - data2[index]);
		}
	}
	return diff / pixelsCounted;
};