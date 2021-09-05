import { bezier } from './helpers/bezier.js';
import { clamp } from '../clamp.js';
import { Colour } from '../Colour.js';
import { mix } from './helpers/mix.js';
import { solveCubic } from './helpers/solveCubic.js';
import { solveQuadratic } from './helpers/solveQuadratic.js';
import { solveQuartic } from './helpers/solveQuartic.js';
import { valueToString } from '../valueToString.js';
import { Vector } from '../drawing/vector/Vector.js';
await Colour.asyncInit();

export class MathCommands {
	static degToRadianScale = Math.PI / 180;
	static GoldenRatio = (1 + Math.sqrt(5)) / 2;

	abs(num1) {
		return Math.abs(num1);
	}

	and() {
		let result = true;
		for (let i = 0; i < arguments.length; i++)
			result = result && arguments[i];
		return result;
	}

	arccos(ratio) {
		return Math.acos(ratio) / MathCommands.degToRadianScale;
	}

	arcsin(ratio) {
		return Math.asin(ratio) / MathCommands.degToRadianScale;
	}

	arctan(ratio) {
		return Math.atan(ratio) / MathCommands.degToRadianScale;
	}

	arctan2(deltaX, deltaY) {
		return Math.atan2(deltaY, deltaX) / MathCommands.degToRadianScale;
	}

	bezier(points, t) {
		return bezier(points, t);
	}

	bitand() {
		var result = 0xffffffff;
		for (var i = 0; i < arguments.length; i++) {
			result = result & arguments[i];
		}
		return result;
	}

	bitnot(int1) {
		return -int1 - 1;
	}

	bitor() {
		var result = 0;
		for (var i = 0; i < arguments.length; i++) {
			result = result | arguments[i];
		}
		return result;
	}

	bitxor() {
		var result = 0;
		for (var i = 0; i < arguments.length; i++) {
			result = result ^ arguments[i];
		}
		return result;
	}

	clamp(num1, min1, max1) {
		return clamp(num1, min1, max1);
	}

	cos(angleDegrees) {
		return Math.cos(angleDegrees * MathCommands.degToRadianScale);
	}

	cosh(x) {
		return Math.cosh(x);
	}

	difference(num1, num2) {
		return num1 - num2;
	}

	equalp(val1, val2) {
		if (val2 instanceof Colour && !(val1 instanceof Colour)) {
			// swap.
			const temp = val1;
			val1 = val2;
			val2 = temp;
		}
		if (val1 instanceof Colour && !(val2 instanceof Colour)) {
			try {
				val2 = new Colour(val2);
			}
			catch (e) {
				return false;
			}
		}
		if (val1 instanceof Colour)
			return val1.equals(val2);
		if (val1 instanceof Array || typeof val1 === 'boolean' || typeof val1 === 'string')
			val1 = valueToString(val1).toLowerCase();
		if (val2 instanceof Array || typeof val2 === 'boolean' || typeof val2 === 'string')
			val2 = valueToString(val2).toLowerCase();
		return val1 == val2;
	}

	evenp(int1) {
		int1 = Math.round(int1);
		return int1 % 2 === 0;
	}

	exp(num1) {
		return Math.exp(num1);
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

	ln(num) {
		return Math.log(num);
	}

	log10(num) {
		return Math.log10(num);
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

	oddp(int1) {
		int1 = Math.round(int1);
		return int1 % 2 === 1;
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

	power(base, exponent) {
		return Math.pow(base, exponent);
	}

	quotient(dividend, divisor) {
		if (divisor === undefined)
			return 1 / dividend; // reciprical
		return dividend / divisor;
	}

	radArcCos(ratio) {
		return Math.acos(ratio);
	}

	radArcSin(ratio) {
		return Math.asin(ratio) ;
	}

	radArcTan(ratio) {
		return Math.atan(ratio);
	}

	radArcTan2(deltaX, deltaY) {
		return Math.atan2(deltaY, deltaX);
	}

	radCos(angleRadians) {
		return Math.cos(angleRadians);
	}

	radSin(angleRadians) {
		return Math.sin(angleRadians);
	}

	radTan(angleRadians) {
		return Math.tan(angleRadians);
	}

	random(max) {
		if (max < 0) {
			this._warn('random command expects a number greater than 0 but received ' + max);
			max = 0;
		}
		return Math.floor(Math.random() * max);
	}

	remainder(dividend, divisor) {
		return dividend % divisor;
	}

	sign(num1) {
		return Math.sign(num1);
	}

	sin(angleDegrees) {
		return Math.sin(angleDegrees * MathCommands.degToRadianScale);
	}

	sinh(x) {
		return Math.sinh(x);
	}

	solveCubic(a, b, c, d) {
		if (a === 0)
			return solveQuadratic(b, c, d);
		else
			return solveCubic(a, b, c, d);
	}

	solveQuadratic(a, b, c) {
		return solveQuadratic(a, b, c);
	}

	solveQuartic(a, b, c, d, e) {
		if (a === 0)
			return this.solveCubic(b, c, d, e);
		else
			return solveQuartic(a, b, c, d, e);
	}

	sqrt(num) {
		return Math.sqrt(num);
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

	tanh(x) {
		return Math.tanh(x);
	}

	xor(input1, input2) {
		return input1 != input2;
	}
};