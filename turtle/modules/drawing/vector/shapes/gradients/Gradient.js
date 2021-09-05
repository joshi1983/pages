import { clamp } from '../../../../clamp.js';
import { asyncInit as colorToContext2DExpressionAsyncInit, colorToContext2DExpression } from './colorToContext2DExpression.js';
import { colorToSVGOpacityExpression } from './colorToSVGOpacityExpression.js';
import { colorToSVGStopColor } from './colorToSVGStopColor.js';
import { EaseLinear } from '../../easing/EaseLinear.js';
import { gradientEasingsToEaseLinearColorStops } from './gradientEasingsToEaseLinearColorStops.js';
import { gradientStopPointMapToArray } from './gradientStopPointMapToArray.js';
import { asyncInit as sanitizeColorStopValueInit, sanitizeColorStopValue } from './sanitizeColorStopValue.js';
import { SpreadMethod } from './SpreadMethod.js';
import { StringBuffer } from '../../../../StringBuffer.js';
import { valueToString } from '../../../../valueToString.js';

async function asyncInit() {
	await sanitizeColorStopValueInit();
	await colorToContext2DExpressionAsyncInit();
}
const initPromise = asyncInit();

export class Gradient {
	static asyncInit() {
		return initPromise;
	}

	constructor(colorStops, spreadMethod) {
		if (!(colorStops instanceof Map))
			throw new Error('colorStops must be a Map.  Not: ' + colorStops);
		if (typeof spreadMethod !== 'number')
			throw new Error('spreadMethod must be a number.  Not: ' + spreadMethod);
		this.spreadMethod = spreadMethod;
		this.colorStops = new Map();
		this.usesOnlyEaseLinear = true;
		if (colorStops instanceof Map)
			this.addColorStops(colorStops);
	}

	addColorStop(ratio, stopPointInfo) {
		if (typeof ratio !== 'number') {
			if (typeof ratio === 'string')
				ratio = '"' + ratio; // indicate it is a string to Logo programmers.
			throw new Error('ratio must be a number.  Not: ' + ratio);
		}
		stopPointInfo = sanitizeColorStopValue(stopPointInfo);
		this.colorStops.set(ratio, stopPointInfo);
		if (!(stopPointInfo.easing instanceof EaseLinear))
			this.usesOnlyEaseLinear = false;
	}

	addColorStops(data) {
		for (const [ratio, stopPoint] of data) {
			this.addColorStop(ratio, stopPoint);
		}
	}

	addColorStopsToContext2dGradient(gradient, numSpreadCycles) {
		if (numSpreadCycles < 2)
			numSpreadCycles = 2;
		let coefficient = 1;
		let colorStops = this.getSortedColorStops(100);
		if (this.spreadMethod !== SpreadMethod.Pad)
			coefficient /= numSpreadCycles;
		if (this.spreadMethod === SpreadMethod.Reflect) {
			let intervalStartRatio = 0;
			let intervalAfterRatio = 0;
			for (let i = 0; i < numSpreadCycles; i+=2) {
				intervalAfterRatio = (i + 2) / numSpreadCycles;
				for (const [ratio, stopPoint] of colorStops) {
					gradient.addColorStop(clamp(intervalStartRatio + ratio * coefficient, 0, 1), colorToContext2DExpression(stopPoint.colour));
				}
				for (const [ratio, stopPoint] of colorStops) {
					gradient.addColorStop(clamp(intervalAfterRatio - ratio * coefficient, 0, 1), colorToContext2DExpression(stopPoint.colour));
				}
				intervalStartRatio = intervalAfterRatio;
			}
		}
		else if (this.spreadMethod === SpreadMethod.Repeat) {
			let intervalStartRatio = 0;
			for (let i = 0; i < numSpreadCycles; i++) {
				for (const [ratio, stopPoint] of colorStops) {
					gradient.addColorStop(clamp(intervalStartRatio + ratio * coefficient, 0, 1), colorToContext2DExpression(stopPoint.colour));
				}
				intervalStartRatio += coefficient;
			}
		}
		else {
			for (const [ratio, stopPoint] of colorStops) {
				gradient.addColorStop(clamp(ratio * coefficient, 0, 1), colorToContext2DExpression(stopPoint.colour));
			}
		}
	}

	equals(other) {
		if (this.colorStops.size !== other.colorStops.size)
			return false;
		for (var [key, val] of this.colorStops) {
			const testVal = other.colorStops.get(key);
			if (testVal !== val && !testVal.equals(val))
				return false;
        }
		return true;
	}

	/*
	SVG gradients don't always work properly if the color stops are listed out of order.
	This was the case when loading an SVG with Edge Version 99.0.1150.36 (Official build) (64-bit).
	*/
	getSortedColorStops(easingDivisionFactor) {
		return gradientEasingsToEaseLinearColorStops(this, easingDivisionFactor);
	}

	getSpreadMethodName() {
		return SpreadMethod.getNameFor(this.spreadMethod);
	}

	getSVGColorStopTags(easingDivisionFactor) {
		const result = new StringBuffer();
		this.getSortedColorStops(easingDivisionFactor).forEach(function(colorStop) {
			const opacitySetting = colorToSVGOpacityExpression(colorStop[1].colour);
			result.append(`\t<stop offset="${colorStop[0]*100}%" stop-color="${colorToSVGStopColor(colorStop[1].colour)}"${opacitySetting} />\n`);
		});
		return result.toString();
	}

	static sanitizeColorStops(colorStops) {
		const sanitizedColorStops = new Map();
		for (const [ratio, stopPointInfo] of colorStops) {
			sanitizedColorStops.set(clamp(ratio, 0, 0.999), sanitizeColorStopValue(stopPointInfo));
		}
		return sanitizedColorStops;
	}

	toString() {
		return valueToString(this.colorStops);
	}
};