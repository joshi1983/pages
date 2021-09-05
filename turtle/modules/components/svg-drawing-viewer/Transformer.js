import { Camera } from '../../drawing/vector/Camera.js';
import { isNumber } from '../../isNumber.js';
import { Vector2D } from '../../drawing/vector/Vector2D.js';
import { Vector3D } from '../../drawing/vector/Vector3D.js';

export class Transformer {
	constructor(width, height) {
		if (typeof width !== 'number')
			throw new Error('width must be a number');
		if (typeof height !== 'number')
			throw new Error('height must be a number');
		this.width = width;
		this.height = height;
		this.scale = 1;
		this.translation = this.getCentreOffset();
	}

	getCentreOffset() {
		return new Vector2D(this.width * 0.5, this.height * 0.5);
	}

	multiplyScaleBy(factor) {
		if (typeof factor !== 'number' || isNaN(factor))
			throw new Error('factor is ' + factor);
		this.setScale(this.scale * factor);
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
		if (typeof scale !== 'number' || isNaN(scale))
			throw new Error('scale must be a number');
		else if (scale === Infinity || scale === -Infinity)
			throw new Error('scale must be finite.  Not: ' + scale);
		else if (scale === 0)
			throw new Error('scale must not be 0');

		const translationFromCentre = this.translation.minus(this.getCentreOffset().multiply(1/this.scale));

		this.translation.assign(translationFromCentre.plus(this.getCentreOffset().multiply(1/scale)));
		this.scale = scale;
	}

	toCamera() {
		const result = new Camera();
		result.position.assign(this.translation.minus(this.getCentreOffset().multiply(1/this.scale)));
		result.position.setY(-result.position.getY());
		result.setZoomScale(this.scale);
		return result;
	}

	translateBy(v) {
		if (v instanceof Vector3D)
			v = v.getXYVector();
		else if (!(v instanceof Vector2D))
			throw new Error('v must be a vector');
		this.translation.assign(this.translation.plus(v.multiply(1/this.scale)));
	}
};