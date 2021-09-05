import { EasingFunction } from './EasingFunction.js';

export class EaseOutCubic extends EasingFunction {
	constructor() {
		super();
	}

	getRatio(ratio) {
		ratio = 1 - ratio;
		return 1 - ratio * ratio * ratio;
	}
};