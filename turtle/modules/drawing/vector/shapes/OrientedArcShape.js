import { AbstractOrientation } from '../AbstractOrientation.js';
import { BoundingBox } from '../BoundingBox.js';
import { EllipseArcShape } from './EllipseArcShape.js';
import { LineCap } from './style/LineCap.js';
import { Shape } from './Shape.js';
import { Vector3D } from '../Vector3D.js';

export class OrientedArcShape extends Shape {
	constructor(centrePosition, orientation, radius, angle, style) {
		if (!(orientation instanceof AbstractOrientation))
			throw new Error('orientation must be an AbstractOrientation but got ' + orientation);

		super(centrePosition, style);
		this.orientation = orientation;
		this.radius = radius;
		this.angle = angle;
	}

	deepClone() {
		return new OrientedArcShape(new Vector3D(this.position),
			this.orientation, this.radius, this.angle, this.style.deepClone());
	}

	getBoundingBox() {
		return BoundingBox.createCubeBox(this.position, this.radius + this.style.getPenWidth() * 0.5);
	}

	getEndPoint() {
		if (this.endPoint === undefined) {
			const p = new Vector3D(0, -this.radius, 0);
			const orientation = this.orientation.clone();
			orientation.right(this.angle);
			this.endPoint = orientation.rotate(p).plus(this.position);
		}
		return this.endPoint;
	}

	getStartPoint() {
		if (this.startPoint === undefined) {
			const p = new Vector3D(0, -this.radius, 0);
			this.startPoint = this.orientation.rotate(p).plus(this.position);
		}
		return this.startPoint;
	}

	getZProjectionShape() {
		if (this.cachedZProjection === undefined) {
			const c = this.position;
			const center = new Vector3D(c.getX(), c.getY(), 0);
			const largeRadius = this.radius;
			const p = new Vector3D(0, 0, 1);
			const rotatedNormal = this.orientation.rotate(p);
			const smallRadius = largeRadius * Math.abs(rotatedNormal.getZ());
			const rotationAngle = Math.atan2(rotatedNormal.getY(), rotatedNormal.getX());
			const endPointOffset = this.getEndPoint().minus(this.position);
			const angle = Math.PI - Math.atan2(endPointOffset.getY(), endPointOffset.getX());
			const startAngle = rotationAngle;
			const style = this.style.deepClone();
			style.setPenWidth(this.style.getPenWidth() * (1 + Math.abs(rotatedNormal.getZ())) / 2);
			return new EllipseArcShape(center, -rotationAngle, smallRadius, largeRadius,
				angle, startAngle, style);
		}
		return this.cachedZProjection;
	}

	isVisible() {
		return this.style.isPenVisible() && (this.angle !== 0 || this.style.getLineCap() !== LineCap.Butt);
	}

	transformBy(camera) {
		return new OrientedArcShape(camera.transform(this.position),
			this.orientation, this.radius * camera.getZoomScale(), this.angle, this.style.transformBy(camera));
	}
};