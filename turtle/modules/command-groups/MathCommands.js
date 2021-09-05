import { betweenp } from './helpers/betweenp.js';
import { bezier } from './helpers/bezier.js';
import { clamp } from '../clamp.js';
import { Colour } from '../Colour.js';
import { equalp } from './helpers/equalp.js';
import { factorial } from './helpers/factorial.js';
import { isNumber } from '../isNumber.js';
import { lessp } from './helpers/lessp.js';
import { mix } from './helpers/mix.js';
import { nChooseK } from './helpers/nChooseK.js';
import { solveCubic } from './helpers/solveCubic.js';
import { solveQuadratic } from './helpers/solveQuadratic.js';
import { solveQuartic } from './helpers/solveQuartic.js';
import { triLengthsToRadianAngle } from './helpers/triLengthsToRadianAngle.js';
import { Vector } from '../drawing/vector/Vector.js';
await Colour.asyncInit();

// used by getCommandPath to allow the JavaScript compiler to call
// Math functions directly and get a tiny performance improvement.
export const directReplacements = new Map([
	['abs', 'Math.abs'],
	['ceiling', 'Math.ceil'],
	['cosh', 'Math.cosh'],
	['exp', 'Math.exp'],
	['floor', 'Math.floor'],
	['integerp', 'Number.isInteger'],
	['ln', 'Math.log'],
	['log10', 'Math.log10'],
	['power', 'Math.pow'],
	['radArcCos', 'Math.acos'],
	['radArcSin', 'Math.asin'],
	['radArcTan', 'Math.atan'],
	['radCos', 'Math.cos'],
	['radSin', 'Math.sin'],
	['radTan', 'Math.tan'],
	['round', 'Math.round'],
	['sign', 'Math.sign'],
	['sinh', 'Math.sinh'],
	['sqrt', 'Math.sqrt'],
	['tanh', 'Math.tanh'],
]);

export class MathCommands {
	static degToRadianScale = Math.PI / 180;
	static GoldenRatio = (1 + Math.sqrt(5)) / 2;

	constructor() {
		/*
		Some methods are nothing but the Math methods.
		It is slightly more efficient to reference the method
		directly instead of implementing a method that does nothing
		but return Math.methodName(...arguments);
		*/
		for (const [key, value] of directReplacements) {
			this[key] = eval(value);
		}
		this.betweenp = betweenp;
		this.equalp = equalp;
		this.factorial = factorial;
		this.lessp = lessp;
		this.nChooseK = nChooseK;
		this.solveQuadratic = solveQuadratic;
		this.triLengthsToRadianAngle = triLengthsToRadianAngle;
	}

	and() {
		let result = true;
		for (let i = 0; i < arguments.length; i++)
			result = result && arguments[i];
		return result;
	}

	arcCos(ratio) {
		return Math.acos(ratio) / MathCommands.degToRadianScale;
	}

	arcSin(ratio) {
		return Math.asin(ratio) / MathCommands.degToRadianScale;
	}

	arcTan(ratio) {
		return Math.atan(ratio) / MathCommands.degToRadianScale;
	}

	arcTan2(deltaX, deltaY) {
		return Math.atan2(deltaY, deltaX) / MathCommands.degToRadianScale;
	}

	aShift(int1, amount) {
		if (amount < 0)
			return int1 >> -amount;
		return int1 << amount;
	}

	bezier(points, t) {
		return bezier(points, t);
	}

	bitAnd() {
		var result = 0xffffffff;
		for (var i = 0; i < arguments.length; i++) {
			result = result & arguments[i];
		}
		return result;
	}

	bitNot(int1) {
		return ~int1;
	}

	bitOr() {
		var result = 0;
		for (var i = 0; i < arguments.length; i++) {
			result = result | arguments[i];
		}
		return result;
	}

	bitShiftLeft(num1, bitCount) {
		return num1 << bitCount;
	}

	bitShiftRight(num1, bitCount) {
		return num1 >> bitCount;
	}

	bitXor() {
		var result = 0;
		for (var i = 0; i < arguments.length; i++) {
			result = result ^ arguments[i];
		}
		return result;
	}

	booleanp(val) {
		return typeof val === 'boolean';
	}

	clamp(num1, min1, max1) {
		return clamp(num1, min1, max1);
	}

	cos(angleDegrees) {
		return Math.cos(angleDegrees * MathCommands.degToRadianScale);
	}

	difference(num1, num2) {
		return num1 - num2;
	}

	evenp(int1) {
		return (int1 & 1) === 0;
	}

	goldenRatio() {
		return MathCommands.GoldenRatio;
	}

	hypot(point) {
		return Vector.euclideanDistance(point);
	}

	int(num1) {
		if (num1 >= 0)
			return Math.floor(num1);
		else
			return Math.ceil(num1);
	}

	lShift(int1, amount) {
		if (amount < 0)
			return int1 >>> -amount;
		return int1 << amount;
	}

	max() {
		// return Math.max(...arguments) is not used here because
		// It would cause an error if length is more than 60,000 or 100,000.
		// This is also faster.
		let result = arguments[0];
		for (let i = 1; i < arguments.length; i++) {
			if (result < arguments[i])
				result = arguments[i];
		}
		return result;
	}

	min() {
		// return Math.min(...arguments) is not used here because
		// same reasons as in max implementation.
		let result = arguments[0];
		for (let i = 1; i < arguments.length; i++) {
			if (result > arguments[i])
				result = arguments[i];
		}
		return result;
	}

	mix(val1, val2, ratio) {
		return mix(val1, val2, ratio);
	}

	modulo(dividend, divisor) {
		let result = dividend % divisor;
		if ((result < 0) !== (divisor < 0))
			result += divisor;
		return result;
	}

	not(val) {
		return !val;
	}

	notEqualp(val1, val2) {
		return !(this.equalp(val1, val2));
	}

	numberp(val) {
		return isNumber(val);
	}

	oddp(int1) {
		return (int1 & 1) === 1;
	}

	or() {
		let result = false;
		for (let i = 0; i < arguments.length; i++)
			result = result || arguments[i];
		return result;
	}

	pi() {
		return Math.PI;
	}

	product() {
		let result = 1;
		for (let i = 0; i < arguments.length; i++) {
			result *= arguments[i];
		}
		return result;
	}

	quotient(dividend, divisor) {
		if (divisor === undefined)
			return 1 / dividend; // reciprical
		return dividend / divisor;
	}

	radArcTan2(deltaX, deltaY) {
		return Math.atan2(deltaY, deltaX);
	}

	remainder(dividend, divisor) {
		return dividend % divisor;
	}

	sin(angleDegrees) {
		return Math.sin(angleDegrees * MathCommands.degToRadianScale);
	}

	solveCubic(a, b, c, d) {
		if (a === 0)
			return solveQuadratic(b, c, d);
		else
			return solveCubic(a, b, c, d);
	}

	solveQuartic(a, b, c, d, e) {
		if (a === 0)
			return this.solveCubic(b, c, d, e);
		else
			return solveQuartic(a, b, c, d, e);
	}

	sum() {
		var result = 0;
		for (let i = 0; i < arguments.length; i++)
			result += arguments[i];
		return result;
	}

	tan(angleDegrees) {
		return Math.tan(angleDegrees * MathCommands.degToRadianScale);
	}

	triLengthsToAngle(a, b, c) {
		return triLengthsToRadianAngle(a, b, c) / MathCommands.degToRadianScale;
	}

	xor(input1, input2) {
		return input1 != input2;
	}
};