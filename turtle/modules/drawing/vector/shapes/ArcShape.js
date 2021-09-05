import { BoundingBox } from '../BoundingBox.js';
import { clampRadianAngle } from '../../../clampRadianAngle.js';
import { Shape } from './Shape.js';
import { Vector3D } from '../Vector3D.js';

export class ArcShape extends Shape {
	constructor(centrePosition, rotationRadians, radius, angle, style) {
		if (typeof radius !== 'number')
			throw new Error('radius must be a number');
		if (radius <= 0)
			throw new Error('radius must be more than 0 but given was ' + radius);
		if (typeof angle !== 'number')
			throw new Error('angle must be a number');
		if (typeof rotationRadians !== 'number')
			throw new Error('rotationRadians must be a number');

		super(centrePosition, style);
		rotationRadians = clampRadianAngle(rotationRadians);

		this.rotationRadians = rotationRadians;
		this.radius = radius;
		this.angle = angle;
	}

	deepClone() {
		return new ArcShape(new Vector3D(this.position), this.rotationRadians, this.radius, this.angle, this.style.deepClone());
	}

	getBoundingBox() {
		let angle = this.angle;
		let rotationRadians = this.rotationRadians;
		// make sure angle is positive.
		if (angle < 0) {
			rotationRadians += angle;
			angle = -angle;
		}
		const result = new BoundingBox();
		const clampedAngle = clampRadianAngle(angle);
		const angles = [rotationRadians, rotationRadians + clampedAngle];
		for (let a = 0; a < Math.PI * 2 + rotationRadians; a += Math.PI * 0.5) {
			if (a >= rotationRadians && a < rotationRadians + clampedAngle) {
				angles.push(a);
			}
		}
		const pw = this.style.getPenWidth() * 0.5;
		for (let i = 0; i < angles.length; i++) {
			const angle = Math.PI * 1.5 - angles[i];
			result.include(this.position.plus(Vector3D.createFromPolar(angle, this.radius + pw)));
			result.include(this.position.plus(Vector3D.createFromPolar(angle, this.radius - pw)));
		}
		return result;
	}

	getStartPoint() {
		return this.position.plus(Vector3D.createFromPolar(Math.PI * 1.5 - this.rotationRadians, this.radius));
	}

	getEndPoint() {
		return this.position.plus(Vector3D.createFromPolar(Math.PI * 1.5 - (this.rotationRadians + this.angle), this.radius));
	}

	isVisible() {
		return this.style.isPenVisible() && this.angle !== 0;
	}

	swapArcDirection() {
		this.rotationRadians += this.angle;
		this.angle = -this.angle;
	}

	transformBy(camera) {
		return new ArcShape(camera.transform(this.position), this.rotationRadians,
			this.radius * camera.getZoomScale(), this.angle, this.style.transformBy(camera));
	}
};