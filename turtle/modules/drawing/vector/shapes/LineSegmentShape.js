import { BoundingBox } from '../BoundingBox.js';
import { LineCap } from './style/LineCap.js';
import { Shape } from './Shape.js';
import { Vector3D } from '../Vector3D.js';

export class LineSegmentShape extends Shape {
	constructor(point1, point2, style) {
		if (!(point2 instanceof Vector3D))
			throw new Error('point2 must be a Vector3D');

		super(point1, style);
		this.endPoint = point2;
	}

	getBoundingBox() {
		// calculate all the points of the rotated line segment.
		if (this.position.getZ() === this.endPoint.getZ()) {
			if (this.style.getLineCap() === LineCap.Butt) {
				let directionVector = this.endPoint.minus(this.position);
				let perpVector = new Vector3D(directionVector.getY(), -directionVector.getX(), 0);
				directionVector = Vector3D.normalize(directionVector);
				perpVector = Vector3D.normalize(perpVector);
				const coords = [
					[0, 1],
					[0, -1],
					[1, 1],
					[1, -1]
				];
				const result = new BoundingBox();
				const pw = this.style.getPenWidth() * 0.5;
				const len = this.position.minus(this.endPoint).magnitude();
				const outer = this;
				coords.forEach(function(coord) {
					result.include(outer.position.plus(directionVector.multiply(coord[0] * len)).plus(perpVector.multiply(coord[1] * pw)));
				});
				return result;
			}
		}
		return new BoundingBox([
			BoundingBox.createCubeBox(this.position, this.style.getPenWidth() * 0.5),
			BoundingBox.createCubeBox(this.endPoint, this.style.getPenWidth() * 0.5)
			]);
	}

	isVisible() {
		return this.style.isPenVisible();
	}

	static sanitizeStyle(style) {
		style.clearFill();
		return style;
	}

	swapEndPoints() {
		const temp = new Vector3D(this.position.coords.slice(0));
		this.position = this.endPoint;
		this.endPoint = temp;
	}

	transformBy(camera) {
		return new LineSegmentShape(camera.transform(this.position), camera.transform(this.endPoint), this.style.transformBy(camera));
	}
};