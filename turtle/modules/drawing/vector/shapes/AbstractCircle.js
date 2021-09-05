import { Shape } from './Shape.js';

export class AbstractCircle extends Shape {
	constructor(centrePosition, radius, style) {
		if (typeof radius !== 'number')
			throw new Error('radius must be a number');
		if (radius <= 0)
			throw new Error('radius must be greater than 0 but given was ' + radius);
		super(centrePosition, style);
		this.radius = radius;
	}

	isVisible() {
		if (this.style.isPenVisible())
			return true;
		return this.radius !== 0 && this.style.usesFill();
	}
};