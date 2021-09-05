import { Colour } from '../../../Colour.js';

export class ColouredLineSegment {
	constructor(point1, point2, colour) {
		if (!(colour instanceof Colour))
			throw new Error(`colour must be a Colour but got ${colour}`);
		this.point1 = point1;
		this.point2 = point2;
		this.colour = colour;
		this.midPoint = this.point1.plus(this.point2).multiply(0.5);
	}
};