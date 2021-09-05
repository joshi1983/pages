import { EventDispatcher } from '../../EventDispatcher.js';
import { DispatchingVector3D } from './DispatchingVector3D.js';
import { isNumber } from '../../isNumber.js';
import { Vector3D } from './Vector3D.js';

export class Camera extends EventDispatcher {
	constructor() {
		super(['change']);
		this.position = new DispatchingVector3D();
		this.zoomScale = 1;
		if (arguments.length > 0) {
			if (typeof arguments[0] === 'object') {
				this.assignFromObject(arguments[0]);
			}
		}
	}

	assignFromObject(cameraInfo) {
		if (isNumber(cameraInfo.zoomScale))
			this.setZoomScale(cameraInfo.zoomScale);
		if (cameraInfo.position instanceof Vector3D)
			this.position.assign(cameraInfo.position);
	}

	getZoomScale() {
		return this.zoomScale;
	}

	isTrivial() {
		return this.zoomScale === 1 && this.position.isZero();
	}

	setZoomScale(zoomScale) {
		if (!isNumber(zoomScale))
			throw new Error('zoomScale must be a number');
		if (zoomScale <= 0)
			throw new Error('zoomScale must always be greater than 0.  Not: ' + zoomScale);

		if (this.zoomScale !== zoomScale) {
			this.zoomScale = zoomScale;
			super._dispatchEvent('change', {'zoomScale': zoomScale});
		}
	}

	transform(v) {
		return this.position.plus(v).multiply(this.zoomScale);
	}

	transform2D(v2d) {
		return this.position.getXYVector().plus(v2d).multiply(this.zoomScale);
	}
};