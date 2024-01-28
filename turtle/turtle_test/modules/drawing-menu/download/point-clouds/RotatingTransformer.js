import { isNumber } from '../../../isNumber.js';
import { PointCloudPoint } from './PointCloudPoint.js';
import { RotatingTransformerModes } from './RotatingTransformerModes.js';
import { Vector2D } from '../../../drawing/vector/Vector2D.js';
import { Vector3D } from '../../../drawing/vector/Vector3D.js';

/*
Used for controlling a 3D perspective rotation of the 3D point cloud
and triggering the necessary redraws.
*/
export class RotatingTransformer {
	constructor(pointCloudPreviewer) {
		this.mode = RotatingTransformerModes.HORIZONTAL;
		this.pointCloudPreviewer = pointCloudPreviewer;
		this.angle = 0;
		this.startTime = (new Date).getTime();
		this.t = setInterval(function() {
			pointCloudPreviewer.redrawNeeded();
		}, 30);
	}

	dispose() {
		clearInterval(this.t);
		this.t = undefined;
		this.pointCloudPreviewer = undefined;
	}

	getAngleRadians() {
		const time = (new Date).getTime();
		const elapsedMilliseconds = time - this.startTime;
		return elapsedMilliseconds * Math.PI * 2 / 5000;
	}

	getTransformedPoints(points) {
		const centre = this.pointCloudPreviewer.pointCentre;
		if (this.mode === RotatingTransformerModes.NONE)
			return points.map(p => new PointCloudPoint(p.vector.minus(centre), p.colour));
		const angle = this.getAngleRadians();
		function rotateXZ(point) {
			const pointVector = point.vector.minus(centre);
			const v = Vector2D.rotate(new Vector2D(pointVector.getX(), pointVector.getZ()), angle);
			const newPointVector = new Vector3D(v.getX(), pointVector.getY(), v.getY());
			return new PointCloudPoint(newPointVector, point.colour);
		}
		function rotateYZ(point) {
			const pointVector = point.vector.minus(centre);
			const v = Vector2D.rotate(new Vector2D(pointVector.getY(), pointVector.getZ()), angle);
			const newPointVector = new Vector3D(pointVector.getX(), v.getX(), v.getY());
			return new PointCloudPoint(newPointVector, point.colour);
		}
		if (this.mode === RotatingTransformerModes.HORIZONTAL)
			return points.map(rotateXZ);
		else
			return points.map(rotateYZ);
	}

	getViewPoint() {
		const r = this.pointCloudPreviewer.rotationRadius;
		if (!isNumber(r))
			throw new Error('PointCloudPreviewer must have rotationRadius calculated before calling getViewPoint()');
		const angle = this.getAngleRadians();
		if (!isNumber(angle))
			throw new Error(`getAngleRadians() unexpectedly returned a non-number ${angle}`);
		const dx = r * Math.cos(angle);
		const dz = r * Math.sin(angle);
		return this.pointCloudPreviewer.pointCentre.plus(new Vector3D(dx, 0, dz));
	}

	setMode(mode) {
		if (!Number.isInteger(mode))
			throw new Error(`mode must be an integer but got ${mode}`);
		this.mode = mode;
	}
};