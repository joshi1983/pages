import { EasingFunction } from './EasingFunction.js';

export class EaseInCubic extends EasingFunction {
	constructor() {
		super();
	}

	getRatio(ratio) {
		return ratio * ratio * ratio;
	}
};