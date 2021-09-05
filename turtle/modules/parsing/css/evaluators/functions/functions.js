import { AlphaColour } from '../../../../AlphaColour.js';
import { clamp } from '../../../../clamp.js';
import { Colour } from '../../../../Colour.js';
import { isNumber } from '../../../../isNumber.js';

function calc(val) {
	if (arguments.length !== 1)
		return;
	return val;
}

// works like:
// https://developer.mozilla.org/en-US/docs/Web/CSS/clamp
function cssClamp(min, val, max) {
	return clamp(val, min, max);
}

// works like:
// https://developer.mozilla.org/en-US/docs/Web/CSS/log
function cssLog(val, optionalBase) {
	if (!isNumber(optionalBase))
		optionalBase = Math.E;
	return Math.log(val) / Math.log(optionalBase);
}

function cssRem(dividend, divisor) {
	return dividend % divisor;
}

function mod(val1, val2) {
	return val1 % val2;
}

function rgb(r, g, b) {
	if (arguments.length !== 3)
		return;
	return new Colour([r, g, b]);
}

function rgba(r, g, b, a) {
	if (arguments.length !== 4)
		return;
	return new AlphaColour([a * 255, r, g, b]);
}

const functions = new Map([
	['calc', calc],
	['clamp', cssClamp],
	['cos', Math.cos],
	['log', cssLog],
	['max', Math.max],
	['min', Math.min],
	['mod', mod],
	['pow', Math.pow],
	['rem', cssRem],
	['rgb', rgb],
	['rgba', rgba],
	['sign', Math.sign],
	['sin', Math.sin],
	['sqrt', Math.sqrt],
	['tan', Math.tan],
]);

export { functions };