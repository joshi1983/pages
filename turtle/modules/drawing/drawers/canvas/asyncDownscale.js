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
	const ctx = canvas.getContext('2d');
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