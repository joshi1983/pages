import { BoundingBox } from '../BoundingBox.js';
import { Shape3D } from './Shape3D.js';
import { Transparent } from '../../../Transparent.js';

export class SphereShape extends Shape3D {
	constructor(position, radius, style) {
		if (typeof radius !== 'number')
			throw new Error('Invalid radius.  Radius must be a number');
		super(position, style);
		this.radius = radius;
	}

	getBoundingBox() {
		return BoundingBox.createCubeBox(this.position, this.radius);
	}

	isVisible() {
		return this.radius > 0 && this.style.getFillColor() !== Transparent;
	}

	transformBy(camera) {
		return new SphereShape(camera.transform(this.position), this.radius * camera.getZoomScale(), this.style.transformBy(camera));
	}
};