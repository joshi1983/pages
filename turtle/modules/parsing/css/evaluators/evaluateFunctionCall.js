import { AlphaColour } from '../../../AlphaColour.js';
import { clamp } from '../../../clamp.js';
import { Colour } from '../../../Colour.js';
import { evaluateToken } from './evaluateToken.js';
import { isNumber } from '../../../isNumber.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const badValueTokenTypes = new Set([
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.CURVED_RIGHT_BRACKET
]);

function isValueToken(token) {
	if (badValueTokenTypes.has(token.type))
		return false;
	return true;
}

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

const funcs = new Map([
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

export function evaluateFunctionCall(token) {
	const firstChild = token.children[0];
	if (firstChild === undefined || firstChild.type !== ParseTreeTokenType.IDENTIFIER)
		return;
	const func = funcs.get(firstChild.val);
	if (func !== undefined) {
		const argList = token.children[1];
		const children = argList.children.filter(isValueToken);
		const vals = children.map(evaluateToken);
		if (vals.some(v => v === undefined))
			return;
		return func(...vals);
	}
};