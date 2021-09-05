import { Colour } from '../../../Colour.js';
import { Vector3D } from '../../../drawing/vector/Vector3D.js';

export class ColouredLineSegment {
	constructor(point1, point2, colour) {
		if (!(point1 instanceof Vector3D))
			throw new Error(`point1 must be a Vector3D but got ${point1}`);
		if (!(point2 instanceof Vector3D))
			throw new Error(`point2 must be a Vector3D but got ${point2}`);
		if (!(colour instanceof Colour))
			throw new Error(`colour must be a Colour but got ${colour}`);
		this.point1 = point1;
		this.point2 = point2;
		this.colour = colour;
		this.midPoint = this.point1.plus(this.point2).multiply(0.5);
	}

	transformWith(vector3DTransformer) {
		const point1 = vector3DTransformer.transform(this.point1);
		if (point1 === undefined)
			return;
		const point2 = vector3DTransformer.transform(this.point2);
		if (point2 === undefined)
			return;
		return new ColouredLineSegment(
			point1,
			point2,
			this.colour);
	}
};