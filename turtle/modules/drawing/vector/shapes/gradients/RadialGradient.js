import { getNumCyclesForShapeAndGradient } from './getNumCyclesForShapeAndGradient.js';
import { Gradient } from './Gradient.js';
import { SpreadMethod } from './SpreadMethod.js';
import { StringBuffer } from '../../../../StringBuffer.js';

let radialGradientCount = 1;

export class RadialGradient extends Gradient {
	constructor(colorStops, outerCentre, focus, radius, spreadMethod) {
		// outerCentre should be a Vector2D.
		if (typeof outerCentre !== 'object' || typeof outerCentre.deepClone !== 'function') {
			throw new Error(`outerCentre invalid.  outerCentre=${outerCentre}`);
		}
		super(colorStops, spreadMethod);
		this.outerCentre = outerCentre;
		this.focus = focus;
		this.radius = radius;
	}

	createFromCanvas2DContext(ctx, dx, dy, shape) {
		const numSpreadCycles = getNumCyclesForShapeAndGradient(shape, this);
		let radiusToUse = this.radius;
		let focusToUse = this.focus;
		if (this.spreadMethod !== SpreadMethod.Pad) {
			numSpreadCycles = Math.max(numSpreadCycles, 20);
			radiusToUse *= numSpreadCycles;
		}
		const result = ctx.createRadialGradient(focusToUse.getX() + dx,
			dy - focusToUse.getY(), 0, this.outerCentre.getX() + dx,
			dy - this.outerCentre.getY(),
			radiusToUse);
		super.addColorStopsToContext2dGradient(result, numSpreadCycles);
		return result;
	}

	deepClone() {
		return new RadialGradient(
			this.colorStops,
			this.outerCentre.deepClone(),
			this.focus.deepClone(),
			this.radius,
			this.spreadMethod);
	}

	equals(other) {
		if (!(other instanceof RadialGradient))
			return false;
		if (!this.outerCentre.equals(other.outerCentre))
			return false;
		if (!this.focus.equals(other.focus))
			return false;
		if (this.radius !== other.radius)
			return false;
		return super.equals(other);
	}

	getId() {
		if (this.id === undefined)
			this.id = 'radial-gradient-' + (radialGradientCount++);
		return this.id;
	}

	toString() {
		return `RadialGradient with colorStops: ${super.toString()}, a center of ${this.outerCentre} and focus of ${this.focus}`;
	}

	toSVGMarkup() {
		const result = new StringBuffer();
		result.append(`<radialGradient id="${this.getId()}" ` +
			`cx="${this.outerCentre.getX()}" cy="${this.outerCentre.getY()}" ` +
			`fx="${this.focus.getX()}" fy="${this.focus.getY()}" ` +
			`r="${this.radius}" gradientUnits="userSpaceOnUse" spreadMethod="${this.getSpreadMethodName()}">\n`);
		result.append(super.getSVGColorStopTags());
		result.append('</radialGradient>');
		return result.toString();
	}

	transformBy(camera) {
		return new RadialGradient(this.colorStops,
			camera.transform2D(this.outerCentre),
			camera.transform2D(this.focus),
			camera.getZoomScale() * this.radius,
			this.spreadMethod);
	}
};