import { clamp } from '../../modules/clamp.js';
import { isNumber } from '../../modules/isNumber.js';

function getColour(x, y) {
	return [0, 0, 0];
}

function calculateColours(scale, left, top, width, height, outPixelData, f) {
	let index;
	const maxX = width - 1;
	for (let y = height - 1; y >= 0; y --) {
		index = y * width << 2;
		const top1 = top + y * scale;
		let x1 = left + maxX * scale;
		for (let x = maxX; x >= 0; x --) {
			const [red, green, blue] = f(x1, top1);
			outPixelData[index++] = red;
			outPixelData[index++] = green;
			outPixelData[index++] = blue;
			outPixelData[index++] = 255; // opaque alpha
			x1 -= scale;
		}
	}
}

function averageColourArray(a) {
	const sums = [0, 0, 0];
	for (let i = 0; i < a.length; i++) {
		const c = a[i];
		for (let j = 0; j < 3; j++) {
			sums[j] += clamp(c[j], 0, 255);
		}
	}
	for (let j = 0; j < 3; j++) {
		sums[j] = Math.round(sums[j] / a.length);
	}
	return sums;
}

function calculateColours2(scale, left, top, width, height, outPixelData, f, subpixelCount) {
	let index;
	const maxX = width - 1;
	const scaleFraction = scale / subpixelCount;
	for (let y = height - 1; y >= 0; y --) {
		index = y * width << 2;
		const top1 = top + y * scale;
		let x1 = left + maxX * scale;
		for (let x = maxX; x >= 0; x --) {
			const a = [];
			let y2 = top1;
			for (let i = 0; i < subpixelCount; i++) {
				let x2 = x1;
				for (let j = 0; j < subpixelCount; j++) {
					a.push(f(x2, y2));
					x2 += scaleFraction;
				}
				y2 += scaleFraction;
			}
			const [red, green, blue] = averageColourArray(a);

			outPixelData[index++] = red;
			outPixelData[index++] = green;
			outPixelData[index++] = blue;
			outPixelData[index++] = 255; // opaque alpha
			x1 -= scale;
		}
	}
}

onmessage = function(e) {
	if (e === null || typeof e !== 'object')
		throw new Error(`e expected to be a non-null object but got ${e}`);
	if (!(e.data instanceof Array))
		throw new Error(`e.data expected to be an Array but got ${e.data}`);
	if (e.data.length !== 6)
		throw new Error(`data.length must be 6 but found ${e.data.length}`);

	const [scale, left, top, width, height, options] = e.data;
	if (!Number.isInteger(width) || width < 1)
		throw new Error(`width must be an integer of at least 1.  Not: ${width}`);
	if (!Number.isInteger(height) || height < 1)
		throw new Error(`height must be an integer of at least 1.  Not: ${height}`);
	if (isNaN(scale) || scale <= 0)
		throw new Error(`scale must be a number greater than 0.  Not: ${scale}`);
	if (isNaN(left))
		throw new Error(`left must be a number.  Not: ${left}`);
	if (isNaN(top))
		throw new Error(`top must be a number.  Not: ${top}`);
	if (typeof options !== 'object')
		throw new Error(`options must be an object but found typeof options to be ${typeof options}`);
	if (!(options.drawCoords instanceof Array))
		throw new Error(`options.drawCoords must be an Array but found options.drawCoords to be ${options.drawCoords}`);
	if (!isNumber(options.subpixelCount))
		throw new Error(`options.subpixelCount must be a number but found ${options.subpixelCount}`);

	const imageData = new ImageData(width, height);
	const result = {
		'imageData': imageData,
		'drawCoords': options.drawCoords,
		'subpixelCount': options.subpixelCount
	};
	const outPixelData = imageData.data;
	let f = getColour;
	if (typeof options === 'object') {
		if (typeof options.implementation === 'string')
			f = new Function('x, y', options.implementation);
	}
	if (options.subpixelCount > 1)
		calculateColours2(scale, left, top, width, height, outPixelData, f, options.subpixelCount);
	else
		calculateColours(scale, left, top, width, height, outPixelData, f);

	postMessage(result);
}