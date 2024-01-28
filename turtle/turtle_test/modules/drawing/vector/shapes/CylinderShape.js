import { BoundingBox } from '../BoundingBox.js';
import { Shape3D } from './Shape3D.js';
import { Vector3D } from '../Vector3D.js';

export class CylinderShape extends Shape3D {
	constructor(point1, point2, radius, style) {
		if (typeof radius !== 'number')
			throw new Error('Cylinder radius must be a number');
		if (!(point1 instanceof Vector3D))
			point1 = new Vector3D(point1);
		if (!(point2 instanceof Vector3D))
			point2 = new Vector3D(point2);

		super(point1, style);
		this.radius = radius;
		this.endPoint = point2;
	}

	static createFromLineSegmentShape(lineSegment) {
		return new CylinderShape(lineSegment.position, lineSegment.endPoint,
			lineSegment.style.getPenWidth() * 0.5, lineSegment.style);
	}

	getBoundingBox() {
		const result = new BoundingBox();
		// FIXME: tighten the box.  
		// FIXME: If the cylinder was vertical, the y-range shouldn't include the radius.

		result.include(BoundingBox.createCubeBox(this.position, this.radius));
		result.include(BoundingBox.createCubeBox(this.endPoint, this.radius));
		return result;
	}

	transformBy(camera) {
		return new CylinderShape(camera.transform(this.position),
			camera.transform(this.endPoint), this.radius * camera.getZoomScale(), this.style.transformBy(camera));
	}
};