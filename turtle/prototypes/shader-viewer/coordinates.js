import { isNumber } from
'../../modules/isNumber.js';

let coordinatesElement, settings;

function getDigitCount() {
	// calculate from canvas size and settings.scale.
	return Math.max(0, Math.ceil(-Math.log10(settings.scale)));
}

function format(num, digitCount) {
	return num.toFixed(digitCount);
}

function screenCoordinatesToShaderCoordinates(x, y) {
	const rect = document.querySelector('canvas').getBoundingClientRect();
	return [
		(x - rect.width / 2) * settings.scale - settings.cx,
		(y - rect.height / 2) * settings.scale + settings.cy
	];
}

export function initCoordinates(settings_) {
	settings = settings_;
	coordinatesElement = document.getElementById('coordinates');
};

export function showCoordinates(x, y) {
	if (!isNumber(x))
		throw new Error(`x must be a number but found ${x}`);
	if (!isNumber(y))
		throw new Error(`y must be a number but found ${y}`);

	coordinatesElement.classList.add('padded');
	[x, y] = screenCoordinatesToShaderCoordinates(x, y);
	const digitCount = getDigitCount();
	const xStr = format(x, digitCount);
	const yStr = format(y, digitCount);
	const msg = `${xStr}, ${yStr}`;
	coordinatesElement.innerText = msg;
};