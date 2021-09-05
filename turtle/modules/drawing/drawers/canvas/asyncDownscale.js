let worker;

function getOrCreateWorker() {
	if (worker === undefined)
		worker = new Worker("./downscaleWorker.js");
	return worker;
}

export function asyncDownscale(scaleFactor, canvas) {
	if (!Number.isInteger(scaleFactor) || scaleFactor < 2)
		throw new Error(`scaleFactor must be an integer at least 2.  Not: ${scaleFactor}`);
	const width = canvas.width;
	const height = canvas.height;
	if (width === 0 || height === 0) {
		// This case will be hit if you resize the viewport to 0 height or 0 width.
		// It is rare but we still want to handle the situation properly.
		return new Promise(function(resolve, reject) {
			reject(new Error(`Neither dimension can be 0 but got width=${width}, height=${height}`));
		});
	}
	const ctx = canvas.getContext('2d');
	ctx.willReadFrequently = true;
	const imageData = ctx.getImageData(0, 0, width, height);
	return new Promise(function(resolve, reject) {
		const myWorker = getOrCreateWorker();
		myWorker.onerror = function(e) {
			reject(e);
		};
		myWorker.onmessage = function(e) {
			resolve(e.data);
		};
		myWorker.postMessage([scaleFactor, imageData]);
	});
};