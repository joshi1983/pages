import { AbstractCircle } from './AbstractCircle.js';
import { BoundingBox } from '../BoundingBox.js';
import { CircleShape } from './CircleShape.js';

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

	getZProjectionShape() {
		
	}

	getBoundingBox() {
		return BoundingBox.createCubeBox(this.position, this.radius + this.style.getPenWidth() * 0.5);
	}

	transformBy(camera) {
		return new OrientedCircleShape(camera.transform(this.position),
			this.orientation, this.radius * camera.getZoomScale(), this.style.transformBy(camera));
	}
};