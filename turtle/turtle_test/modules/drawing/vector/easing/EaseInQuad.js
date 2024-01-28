import { EasingFunction } from './EasingFunction.js';

export class EaseInQuad extends EasingFunction {
	constructor() {
		super();
	}

	getRatio(ratio) {
		return ratio * ratio;
	}
};