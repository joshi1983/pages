import { AbstractCircle } from './AbstractCircle.js';
import { BoundingBox } from '../BoundingBox.js';

export class CircleShape extends AbstractCircle {
	constructor(centrePosition, radius, style) {
		super(centrePosition, radius, style);
	}

	getBoundingBox() {
		return BoundingBox.createZSquare(this.position, this.radius + this.style.getPenWidth() * 0.5);
	}

	transformBy(camera) {
		return new CircleShape(camera.transform(this.position),
			this.radius * camera.getZoomScale(), this.style.transformBy(camera));
	}
};