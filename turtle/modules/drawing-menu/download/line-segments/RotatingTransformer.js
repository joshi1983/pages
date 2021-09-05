import { AbstractRotatingTransformer } from '../AbstractRotatingTransformer.js';
import { ColouredLineSegment } from './ColouredLineSegment.js';
import { isNumber } from '../../../isNumber.js';
import { RotatingTransformerModes } from '../RotatingTransformerModes.js';
import { Vector3D } from '../../../drawing/vector/Vector3D.js';

/*
Used for controlling a 3D perspective rotation of the 3D line segments set
and triggering the necessary redraws.
*/
export class RotatingTransformer extends AbstractRotatingTransformer {
	constructor(lineSegmentsPreviewer) {
		super(RotatingTransformerModes.HORIZONTAL, 0);
		this.lineSegmentsPreviewer = lineSegmentsPreviewer;
		this.t = setInterval(function() {
			lineSegmentsPreviewer.redrawNeeded();
		}, 30);
	}

	dispose() {
		super.dispose();
		this.lineSegmentsPreviewer = undefined;
	}

	getTransformedLines(lines) {
		const centre = this.lineSegmentsPreviewer.pointCentre;
		if (this.mode === RotatingTransformerModes.NONE)
			return lines.map(line => new ColouredLineSegment(line.point1.minus(centre), line.point2.minus(centre), line.colour));
		const angle = this.getAngleRadians();
		function rotateXZPoint(v) {
			return AbstractRotatingTransformer.rotateXZ(v, centre, angle);
		}
		function rotateXZ(line) {
			return new ColouredLineSegment(rotateXZPoint(line.point1), rotateXZPoint(line.point2), line.colour);
		}
		function rotateYZPoint(v) {
			return AbstractRotatingTransformer.rotateYZ(v, centre, angle);
		}
		function rotateYZ(line) {
			return new ColouredLineSegment(rotateYZPoint(line.point1), rotateYZPoint(line.point2), line.colour);
		}
		if (this.mode === RotatingTransformerModes.HORIZONTAL)
			return lines.map(rotateXZ);
		else
			return lines.map(rotateYZ);
	}

	getViewPoint() {
		const r = this.lineSegmentsPreviewer.rotationRadius;
		if (!isNumber(r))
			throw new Error('LineSegmentsPreviewer must have rotationRadius calculated before calling getViewPoint()');
		const angle = this.getAngleRadians();
		if (!isNumber(angle))
			throw new Error(`getAngleRadians() unexpectedly returned a non-number ${angle}`);
		const dx = r * Math.cos(angle);
		const dz = r * Math.sin(angle);
		return this.lineSegmentsPreviewer.pointCentre.plus(new Vector3D(dx, 0, dz));
	}
};