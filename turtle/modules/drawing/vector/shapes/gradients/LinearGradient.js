import { Gradient } from './Gradient.js';
import { SpreadMethod } from './SpreadMethod.js';
import { StringBuffer } from '../../../../StringBuffer.js';
import { Vector } from '../../Vector.js';

let linearGradientCount = 1;

export class LinearGradient extends Gradient {
	/*
	from should be a Vector2D.
	to should be a Vector2D.
	*/
	constructor(colorStops, from, to, spreadMethod) {
		super(colorStops, spreadMethod);
		this.from = from;
		this.to = to;
	}

	createFromCanvas2DContext(ctx, dx, dy, numSpreadCycles) {
		if (numSpreadCycles === undefined)
			numSpreadCycles = 1;
		let from = this.from;
		let to = this.to;
		if (this.spreadMethod !== SpreadMethod.Pad) {
			numSpreadCycles = Math.max(Math.ceil(numSpreadCycles), 20);
			let roundUpInterval;
			if (this.spreadMethod === SpreadMethod.Repeat)
				roundUpInterval = 2;
			else if (this.spreadMethod === SpreadMethod.Reflect)
				roundUpInterval = 4;
			if (roundUpInterval !== undefined)
				numSpreadCycles = numSpreadCycles + roundUpInterval - numSpreadCycles % roundUpInterval;
			const originalDisplacement = to.minus(from);
			to = from.plus(originalDisplacement.multiply(numSpreadCycles * 0.5));
			from = from.minus(originalDisplacement.multiply(numSpreadCycles * 0.5));
		}
		const result = ctx.createLinearGradient(from.getX() + dx,
			dy - from.getY(),
			to.getX() + dx, dy - to.getY());
		super.addColorStopsToContext2dGradient(result, numSpreadCycles);
		return result;
	}

	deepClone() {
		return new LinearGradient(
			this.colorStops,
			this.from.deepClone(),
			this.to.deepClone(),
			this.spreadMethod);
	}

	equals(other) {
		if (!(other instanceof LinearGradient))
			return false;
		if (!this.from.equals(other.from))
			return false;
		if (!this.to.equals(other.to))
			return false;
		return super.equals(other);
	}

	getId() {
		if (this.id === undefined)
			this.id = 'linear-gradient-' + (linearGradientCount++);
		return this.id;
	}

	toString() {
		return `LinearGradient with colorStops: ${super.toString()} from ${this.from} to ${this.to}`;
	}

	toSVGMarkup() {
		const result = new StringBuffer();
		result.append(`<linearGradient id="${this.getId()}" x1="${this.from.getX()}" y1="${this.from.getY()}" x2="${this.to.getX()}" y2="${this.to.getY()}" gradientUnits="userSpaceOnUse" spreadMethod="${this.getSpreadMethodName()}">\n`);
		result.append(super.getSVGColorStopTags());
		result.append('</linearGradient>');
		return result.toString();
	}

	transformBy(camera) {
		return new LinearGradient(this.colorStops,
			camera.transform2D(this.from),
			camera.transform2D(this.to),
			this.spreadMethod);
	}
};