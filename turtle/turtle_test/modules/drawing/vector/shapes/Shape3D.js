import { Vector3D } from '../Vector3D.js';
import { Shape } from './Shape.js';

export class Shape3D extends Shape {
	constructor(position, style) {
		if (!(position instanceof Vector3D))
			position = new Vector3D(position);

		super(position, style);
	}
};