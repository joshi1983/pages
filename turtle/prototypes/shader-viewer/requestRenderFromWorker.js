let settings;
let worker;
let isWaitingForWorker = false;
let isNeedingFreshRenderRequest = false;
let subpixelCount = 1;
let antialiasTimeout;

function onmessage(e) {
	const resultData = e.data;
	const imageData = resultData.imageData;
	const drawCoords = resultData.drawCoords;
	if (!(imageData instanceof ImageData))
		console.error(`Expected an instance of ImageData but imageData=${imageData}`);
	else {
		createImageBitmap(imageData).then(function(imgBitmap) {
			const context = settings.canvas.getContext('2d');
			context.drawImage(imgBitmap, drawCoords[0], drawCoords[1]);
			isWaitingForWorker = false;
			if (isNeedingFreshRenderRequest)
				requestRenderFromWorker();
			else {
				subpixelCount = resultData.subpixelCount;
				if (subpixelCount < 8)
					delayedRequestAntialiased();
				else
					clearAntialiasedTimeout();
			}
		});
	}
} 

function onerror(e) {
	console.error(e);
}

export function initWorker(settings_) {
	settings = settings_;
	worker = new Worker("./prototypes/shader-viewer/shaderWorker.js", { 'type': "module" });
	worker.onmessage = onmessage;
	worker.onerror = onerror;
}

const getBody = (string) => string.substring(
  string.indexOf("{") + 1,
  string.lastIndexOf("}")
)

function f2(x, y) {
	const iterations = 264;
	const coefficient = {'a': -0.5125, 'b': 0.5213};
	let i;
	for (i = 0; i < iterations; i++){
		if(x + y > 4) break;

		const new_x = x*x - y*y + coefficient.a;
		const new_y = 2*x*y + coefficient.b;

		x = new_x;
		y = new_y;
	}

	const val1 = Math.min(255, i * 256 / iterations);
	const val2 = (x + y) - 4;
	const r = val1;
	const g = Math.min(255, val1 / 3 + val2 * 10);
	const b = Math.min(255, val2 * 256); 
	return [r, g, b];
}

function turtleFractal(x, y) {
	let a = x;
	let b = y;

	// Iterate over t values to calculate d value
	for (let t = 1; t < 200; t++) {

		// Calculate d value using a and b values from previous iteration
		const d = a * a - b * b + x;
		b = 2 * b * a + y;
		a = d + b / d * b;

		// Check if d value exceeds threshold
		if (d > 200) {
			// Calculate index in data array for current pixel
			return [t * 3, t, t * 0.5];
		}
	}
	return [0, 0, 0];
}

function clearAntialiasedTimeout() {
	if (antialiasTimeout !== undefined) {
		clearTimeout(antialiasTimeout);
		antialiasTimeout = undefined;
	}
}

function delayedRequestAntialiased() {
	clearAntialiasedTimeout();

	antialiasTimeout = setTimeout(requestAntialiased, 1000 * subpixelCount);
}

const functionCode = getBody(turtleFractal.toString());

function requestAntialiased() {
	const left = settings.cx - settings.canvas.width * settings.scale / 2;
	const options = {
		'implementation': functionCode,
		'drawCoords': [0, 0],
		'subpixelCount': subpixelCount + 1
	};
	worker.postMessage([settings.scale, left, 
		settings.cy - settings.canvas.height * settings.scale / 2, settings.canvas.width, settings.canvas.height,
		options]);
}

export function requestRenderFromWorker() {
	clearAntialiasedTimeout();
	subpixelCount = 1;
	if (!isWaitingForWorker) {
		isWaitingForWorker = true;
		isNeedingFreshRenderRequest = false;
		const left = settings.cx - settings.canvas.width * settings.scale / 2;
		const options = {
			'implementation': functionCode,
			'drawCoords': [0, 0],
			'subpixelCount': 1
		};
		worker.postMessage([settings.scale, left, 
			settings.cy - settings.canvas.height * settings.scale / 2, settings.canvas.width, settings.canvas.height,
			options]);
	}
	else
		isNeedingFreshRenderRequest = true;
};