import { AbstractCircle } from './AbstractCircle.js';
import { AbstractOrientation } from '../AbstractOrientation.js';
import { BoundingBox } from '../BoundingBox.js';
import { CircleShape } from './CircleShape.js';
import { EllipseShape } from './EllipseShape.js';
import { Vector3D } from '../Vector3D.js';

/*
Similar to CircleShape but with a more complicated orientation
*/
export class OrientedCircleShape extends AbstractCircle {
	constructor(centrePosition, orientation, radius, style) {
		if (!(orientation instanceof AbstractOrientation))
			throw new Error('orientation must be an AbstractOrientation but got ' + orientation);

		super(centrePosition, radius, style);
		this.orientation = orientation;
	}

	getBoundingBox() {
		return BoundingBox.createCubeBox(this.position, this.radius + this.style.getPenWidth() * 0.5);
	}

	getZProjectionShape() {
		if (this.cachedZProjection === undefined) {
			const c = this.position;
			const center = new Vector3D(c.getX(), c.getY(), 0);
			const largeRadius = this.radius;
			const p = new Vector3D(0, 0, 1);
			const rotatedNormal = this.orientation.rotate(p);
			const smallRadius = largeRadius * Math.abs(rotatedNormal.getZ());
			const angle = Math.atan2(rotatedNormal.getY(), rotatedNormal.getX());
			// get a few points on the circumference of the circle.
			// calculate an EllipseShape on the z=0 plane that best fits the
			// OrientedCircleShape.
			const style = this.style.deepClone();
			style.setPenWidth(this.style.getPenWidth() * (1 + Math.abs(rotatedNormal.getZ())) / 2);
			return new EllipseShape(center, -angle, smallRadius, largeRadius, style);
		}
		return this.cachedZProjection;
	}

	transformBy(camera) {
		return new OrientedCircleShape(camera.transform(this.position),
			this.orientation, this.radius * camera.getZoomScale(), this.style.transformBy(camera));
	}
};