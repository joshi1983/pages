import { EllipseShape } from './EllipseShape.js';
import { Shape } from './Shape.js';

export class EllipseArcShape extends Shape {
	constructor(position, rotationRadians, radius1, radius2, angle, startAngle, style) {
		if (typeof rotationRadians !== 'number')
			throw new Error('rotationRadians must be a number. Not: ' + rotationRadians);
		if (typeof radius1 !== 'number')
			throw new Error('radius1 must be a number. Not: ' + radius1);
		if (typeof radius2 !== 'number')
			throw new Error('radius2 must be a number.  Not: ' + radius2);
		if (typeof angle !== 'number')
			throw new Error('angle must be a number.  Not: ' + angle);
		if (typeof startAngle !== 'number')
			throw new Error('startAngle must be a number.  Not: ' + startAngle);

		super(position, style);
		this.rotationRadians = rotationRadians;
		this.radius1 = radius1;
		this.radius2 = radius2;
		this.angle = angle;
		this.startAngle = startAngle;
		this.radiiRatio = radius1 / radius2;
	}

	getBoundingBox() {
		// FIXME: narrow this box using the specific start and end point, angles... like is done with ArcShape.
		return this.toCorrespondingEllipse().getBoundingBox();
	}

	isVisible() {
		return this.style.isPenVisible();
	}

	toCorrespondingEllipse() {
		return new EllipseShape(this.position, this.rotationRadians, this.radius1, this.radius2, this.style);
	}

	transformBy(camera) {
		return new EllipseArcShape(camera.transform(this.position), this.rotationRadians,
			this.radius1 * camera.getZoomScale(), this.radius2 * camera.getZoomScale(),
			this.angle, this.startAngle, this.style.transformBy(camera));
	}
}