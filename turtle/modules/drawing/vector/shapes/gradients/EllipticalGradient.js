import { Gradient } from './Gradient.js';
import { SpreadMethod } from './SpreadMethod.js';
import { StringBuffer } from '../../../../StringBuffer.js';
import { Vector2D } from '../../Vector2D.js';

let ellipseGradientCount = 1;

export class EllipticalGradient extends Gradient {
	constructor(colorStops, outerCentre, radius1, radius2, rotationRadians, spreadMethod) {
		// outerCentre should be a Vector2D.
		if (typeof outerCentre !== 'object' || typeof outerCentre.deepClone !== 'function') {
			throw new Error(`outerCentre invalid.  outerCentre=${outerCentre}`);
		}
		super(colorStops, spreadMethod);
		this.outerCentre = outerCentre;
		this.radius1 = radius1;
		this.radius2 = radius2;
		this.rotationRadians = rotationRadians;
	}

	createFromCanvas2DContext(ctx, dx, dy, numSpreadCycles) {
		if (typeof numSpreadCycles !== 'number')
			numSpreadCycles = 20;
		let radiusToUse = this.radius1;
		let focusToUse = this.outerCentre;
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
		return new EllipticalGradient(
			this.colorStops,
			this.outerCentre.deepClone(),
			this.radius1,
			this.radius2,
			this.rotationRadians,
			this.spreadMethod);
	}

	equals(other) {
		if (!(other instanceof EllipticalGradient))
			return false;
		if (!this.outerCentre.equals(other.outerCentre))
			return false;
		if (this.radius1 !== other.radius1)
			return false;
		if (this.radius2 !== other.radius2)
			return false;
		if (this.rotationRadians !== other.rotationRadians)
			return false;
		return super.equals(other);
	}

	getId() {
		if (this.id === undefined)
			this.id = 'elliptical-gradient-' + (ellipseGradientCount++);
		return this.id;
	}

	toString() {
		return `EllipticalGradient with colorStops: ${super.toString()}, a center of ${this.outerCentre}`;
	}

	toSVGMarkup() {
		const result = new StringBuffer();
		const scale = this.radius1 / this.radius2;
		let p = this.outerCentre.deepClone();
		p = Vector2D.rotate(p, this.rotationRadians);
		p.setX(p.getX() / scale);
		result.append(`<radialGradient id="${this.getId()}" ` +
			`cx="${p.getX()}" cy="${p.getY()}" ` +
			`gradientTransform="rotate(${-this.rotationRadians * 180 / Math.PI}), scale(${scale}, 1)" ` +
			`r="${this.radius1}" gradientUnits="userSpaceOnUse" spreadMethod="${this.getSpreadMethodName()}">\n`);
		result.append(super.getSVGColorStopTags());
		result.append('</radialGradient>');
		return result.toString();
	}

	transformBy(camera) {
		return new EllipticalGradient(this.colorStops,
			camera.transform2D(this.outerCentre),
			camera.getZoomScale() * this.radius1,
			camera.getZoomScale() * this.radius2,
			this.rotationRadians,
			this.spreadMethod);
	}
};