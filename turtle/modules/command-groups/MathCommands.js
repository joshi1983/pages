import { Colour } from '../Colour.js';
import { DataTypes } from '../parsing/data-types/DataTypes.js';
import { dataTypesToEnglish } from '../help/command-details/dataTypesToEnglish.js';
import { solveCubic } from './helpers/solveCubic.js';
import { solveQuartic } from './helpers/solveQuartic.js';
import { valueToString } from '../valueToString.js';
import { Vector } from '../drawing/vector/Vector.js';

function getDataTypeDescription(val) {
	const types = DataTypes.getTypesCompatibleWithValue(val);
	return dataTypesToEnglish(types);
}

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
		return Math.max(...arguments);
	}

	min() {
		return Math.min(...arguments);
	}

	mix(val1, val2, ratio) {
		if (typeof val1 === 'number' && typeof val2 === 'number')
			return val1 * ratio + val2 * (1 - ratio);
		else if (val1 instanceof Array && val2 instanceof Array) {
			if (val1.length !== val2.length)
				throw new Error(`val1 length must match val2 length but val1's length of ${val1.length} is not equal to ${val2.length}`);
			const result = [];
			for (let i = 0; i < val1.length; i++) {
				result.push(this.mix(val1[i], val2[i], ratio));
			}
			return result;
		}
		else if (Colour.canBeInterprettedAsColour(val1) && Colour.canBeInterprettedAsColour(val2))
			return this.mix(new Colour(val1).rgbArray, new Colour(val2).rgbArray, ratio);
		else {
			throw new Error('The first 2 inputs must both be numbers, both be lists, or both be colors. ' + 
				`Instead, val1 is of type ${getDataTypeDescription(val1)} and val2 is of type ${getDataTypeDescription(val2)}`);
		}
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
			return this.solveQuadratic(b, c, d);
		else
			return solveCubic(a, b, c, d);
	}

	solveQuadratic(a, b, c) {
		if (a === 0) {
			if (b === 0) {
				if (c === 0)
					// The equation simplifies to: 0 = 0.
					return [0];// infinite solutions actually but let's give just 1.
				else
					return []; // some constant other than 0 = 0 so no solution.
			}
			// Solve bx + c = 0.
			// bx = -c
			// x = -c / b.
			return [-c / b];
		}
		let discriminant = b * b - 4 * a * c;
		if (discriminant < 0)
			return [];
		else if (discriminant === 0) {
			return [-b / (a + a)];
		}
		else {
			a += a; // same as a = a * 2.
			discriminant = Math.sqrt(discriminant);
			return [(-b - discriminant) / a, (-b + discriminant) / a];
		}
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