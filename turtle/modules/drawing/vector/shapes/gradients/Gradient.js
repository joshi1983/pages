import { clamp } from '../../../../clamp.js';
import { Colour } from '../../../../Colour.js';
import { SpreadMethod } from './SpreadMethod.js';
import { StringBuffer } from '../../../../StringBuffer.js';
import { valueToString } from '../../../../valueToString.js';

function compareByFirstValue(e1, e2) {
	return e1[0] - e2[0];
}

export class Gradient {
	constructor(colorStops, spreadMethod) {
		if (!(colorStops instanceof Map))
			throw new Error('colorStops must be a Map.  Not: ' + colorStops);
		if (typeof spreadMethod !== 'number')
			throw new Error('spreadMethod must be a number.  Not: ' + spreadMethod);
		this.spreadMethod = spreadMethod;
		this.colorStops = new Map();
		if (colorStops instanceof Map)
			this.addColorStops(colorStops);
	}

	addColorStop(ratio, colour) {
		if (typeof ratio !== 'number') {
			if (typeof ratio === 'string')
				ratio = '"' + ratio; // indicate it is a string to Logo programmers.
			throw new Error('ratio must be a number.  Not: ' + ratio);
		}
		if (!(colour instanceof Colour))
			throw new Error('colour must be a Colour.  Not: ' + colour);
		this.colorStops.set(ratio, colour);
	}

	addColorStops(data) {
		for (const [ratio, colour] of data) {
			this.addColorStop(ratio, colour);
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

	addColorStopsToContext2dGradient(gradient, numSpreadCycles) {
		if (numSpreadCycles < 2)
			numSpreadCycles = 2;
		let coefficient = 1;
		if (this.spreadMethod !== SpreadMethod.Pad)
			coefficient /= numSpreadCycles;
		if (this.spreadMethod === SpreadMethod.Reflect) {
			let intervalStartRatio = 0;
			let intervalAfterRatio = 0;
			for (let i = 0; i < numSpreadCycles; i+=2) {
				intervalAfterRatio = (i + 2) / numSpreadCycles;
				for (const [ratio, color] of this.colorStops) {
					gradient.addColorStop(clamp(intervalStartRatio + ratio * coefficient, 0, 1), color.toString());
				}
				for (const [ratio, color] of this.colorStops) {
					gradient.addColorStop(clamp(intervalAfterRatio - ratio * coefficient, 0, 1), color.toString());
				}
				intervalStartRatio = intervalAfterRatio;
			}
		}
		else if (this.spreadMethod === SpreadMethod.Repeat) {
			let intervalStartRatio = 0;
			for (let i = 0; i < numSpreadCycles; i++) {
				for (const [ratio, color] of this.colorStops) {
					gradient.addColorStop(clamp(intervalStartRatio + ratio * coefficient, 0, 1), color.toString());
				}
				intervalStartRatio += coefficient;
			}
		}
		else {
			for (const [ratio, color] of this.colorStops) {
				gradient.addColorStop(clamp(ratio * coefficient, 0, 1), color.toString());
			}
		}
	}

	/*
	SVG gradients don't always work properly if the color stops are listed out of order.
	This was the case when loading an SVG with Edge Version 99.0.1150.36 (Official build) (64-bit).
	*/
	getSortedColorStops() {
		const result = [];
		for (const [key, value] of this.colorStops) {
			result.push([key, value]);
		}
		result.sort(compareByFirstValue);
		return result;
	}

	getSpreadMethodName() {
		return SpreadMethod.getNameFor(this.spreadMethod);
	}

	getSVGColorStopTags() {
		const result = new StringBuffer();
		this.getSortedColorStops().forEach(function(colorStop) {
			result.append(`\t<stop offset="${colorStop[0]*100}%" style="stop-color:${colorStop[1].toString()}" />\n`);
		});
		return result.toString();
	}

	static sanitizeColorStops(colorStops) {
		const sanitizedColorStops = new Map();
		for (const [ratio, color] of colorStops) {
			sanitizedColorStops.set(clamp(ratio, 0, 0.999), new Colour(color));
		}
		return sanitizedColorStops;
	}

	toString() {
		return valueToString(this.colorStops);
	}
};