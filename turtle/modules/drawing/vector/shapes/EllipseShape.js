import { BoundingBox } from '../BoundingBox.js';
import { getXIntersectionMiddleForEllipse } from './math/getXIntersectionMiddleForEllipse.js';
import { Shape } from './Shape.js';
import { Vector2D } from '../Vector2D.js';
import { Vector3D } from '../Vector3D.js';

export class EllipseShape extends Shape {
	constructor(position, rotationRadians, radius1, radius2, style) {
		if (typeof rotationRadians !== 'number')
			throw new Error('rotationRadians must be a number');
		if (typeof radius1 !== 'number')
			throw new Error('radius1 must be a number');
		if (typeof radius2 !== 'number')
			throw new Error('radius2 must be a number');
		radius1 = Math.abs(radius1);
		radius2 = Math.abs(radius2);
		super(position, style);
		this.rotationRadians = rotationRadians;
		this.radius1 = radius1;
		this.radius2 = radius2;
	}

	/*
	Returns an Array of hundreds of points around the perimeter of this ellipse that 
	is not translated by this.position or rotated by this.rotationRadians.
	*/
	_getPerimeterPoints() {
		const result1 = [];
		const numSlices = 50;
		const interval1 = 1 / numSlices;
		for (let y = 0; y < 1; y += interval1) {
			const x = this.radius1 * Math.sqrt(1 - y * y);
			result1.push(new Vector2D(x, y * this.radius2));
		}
		for (let x = 0; x < 1; x += interval1) {
			const y = this.radius2 * Math.sqrt(1 - x * x);
			result1.push(new Vector2D(x * this.radius1, y));
		}
		const result2 = [];
		for (let i = 0; i < result1.length; i++) {
			const p = result1[i];
			result2.push(p);
			result2.push(new Vector2D(p.getX(), -p.getY()));
			result2.push(new Vector2D(-p.getX(), p.getY()));
			result2.push(new Vector2D(-p.getX(), -p.getY()));
		}
		return result2;
	}

	getBoundingBox() {
		return this.getBoundingBox2D();
	}

	// getBoundingBox2D assumes the orientation of this ellipse doesn't have a roll or pitch.
	// In other words, it works for ellipses with any z-coordinate but only if the ellipse isn't rotated in the 3rd dimension.
	getBoundingBox2D() {
		// math formula found at: 
		// https://math.stackexchange.com/questions/91132/how-to-get-the-limits-of-rotated-ellipse
		const rotatedXLimit = Math.hypot(this.radius1 * Math.cos(this.rotationRadians), this.radius2 * Math.sin(this.rotationRadians));
		const rotatedYLimit = Math.hypot(this.radius1 * Math.sin(this.rotationRadians), this.radius2 * Math.cos(this.rotationRadians));
		const result = new BoundingBox();
		result.include(this.position.plus(new Vector3D(rotatedXLimit, rotatedYLimit, 0)));
		result.include(this.position.plus(new Vector3D(-rotatedXLimit, -rotatedYLimit, 0)));
		return result;
	}

	getLowestPoint() {
		const rotatedYLimit = Math.hypot(this.radius1 * Math.sin(this.rotationRadians), this.radius2 * Math.cos(this.rotationRadians));
		const xValue = getXIntersectionMiddleForEllipse(this, this.position.getY() - rotatedYLimit);
		return new Vector2D(xValue, this.position.getY() - rotatedYLimit);
	}

	transformBy(camera) {
		return new EllipseShape(camera.transform(this.position), this.rotationRadians,
			this.radius1 * camera.getZoomScale(), this.radius2 * camera.getZoomScale(), this.style.transformBy(camera));
	}
};