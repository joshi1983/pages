import { isNumber } from '../../../isNumber.js';
import { Vector } from '../../vector/Vector.js';
import { Vector2D } from '../../vector/Vector2D.js';
import { Vector3D } from '../../vector/Vector3D.js';

export class PerspectiveTransformer {
	constructor(width, height) {
		if (!isNumber(width))
			throw new Error('width must be a number but got ' + width);
		if (!isNumber(height))
			throw new Error('height must be a number but got ' + height);

		this.width = width;
		this.height = height;
		this.position = new Vector3D();
		this.zoomScale = 2;
	}

	getCentreOffset() {
		return new Vector2D(this.width * 0.5, this.height * 0.5);
	}

	getZScale(v3d) {
		v3d = v3d.minus(this.position);
		const scale = v3d.getZ();
		if (scale <= 0)
			return undefined; // indicate the point can't be converted.
		return 1 / scale;
	}

	multiplyScaleBy(factor) {
		if (!isNumber(factor))
			throw new Error('factor must be a number.  Not: ' + factor);
		this.zoomScale *= factor;
	}

	setDimensions(width, height) {
		if (!isNumber(width))
			throw new Error('width must be a number.  Not: ' + width);
		if (!isNumber(height))
			throw new Error('height must be a number. Not: ' + height);

		this.translateBy(new Vector2D((width - this.width) * 0.5, (height - this.height) * 0.5));
		this.width = width;
		this.height = height;
	}

	setScale(scale) {
		if (!isNumber(scale))
			throw new Error('scale must be a number.  Not: ' + scale);
		this.zoomScale = scale;
	}

	transform(v3d) {
		const dimensionScale = (this.width + this.height) / 2;
		v3d = v3d.minus(this.position);
		let result = v3d.getXYVector();
		const scale = v3d.getZ();
		if (scale <= 0)
			return undefined; // indicate the point can't be converted.
		result = result.multiply(this.zoomScale * dimensionScale / scale);
		return result.plus(new Vector3D(this.width / 2, this.height / 2, 0));
	}

	translateBy(v) {
		if (!(v instanceof Vector))
			throw new Error('v must be a Vector.  Not: ' + v);

		this.position.assign(this.position.plus(v));
	}
};