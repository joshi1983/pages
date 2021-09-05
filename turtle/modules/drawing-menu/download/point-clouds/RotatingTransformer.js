import { AbstractRotatingTransformer } from '../AbstractRotatingTransformer.js';
import { isNumber } from '../../../isNumber.js';
import { PointCloudPoint } from './PointCloudPoint.js';
import { RotatingTransformerModes } from '../RotatingTransformerModes.js';
import { Vector3D } from '../../../drawing/vector/Vector3D.js';

/*
Used for controlling a 3D perspective rotation of the 3D point cloud
and triggering the necessary redraws.
*/
export class RotatingTransformer extends AbstractRotatingTransformer {
	constructor(pointCloudPreviewer) {
		super(RotatingTransformerModes.HORIZONTAL, 0);
		this.pointCloudPreviewer = pointCloudPreviewer;
		this.t = setInterval(function() {
			pointCloudPreviewer.redrawNeeded();
		}, 30);
	}

	dispose() {
		super.dispose();
		this.pointCloudPreviewer = undefined;
	}

	getTransformedPoints(points) {
		const centre = this.pointCloudPreviewer.pointCentre;
		if (this.mode === RotatingTransformerModes.NONE)
			return points.map(p => new PointCloudPoint(p.vector.minus(centre), p.colour));
		const angle = this.getAngleRadians();
		function rotateXZ(point) {
			const newPointVector = AbstractRotatingTransformer.rotateXZ(point.vector, centre, angle);
			return new PointCloudPoint(newPointVector, point.colour);
		}
		function rotateYZ(point) {
			const newPointVector = AbstractRotatingTransformer.rotateYZ(point.vector, centre, angle);
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
};