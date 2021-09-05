import { EasingFunction } from './EasingFunction.js';

export class EaseOutQuad extends EasingFunction {
	constructor() {
		super();
	}

	getRatio(ratio) {
		ratio = 1 - ratio;
		return 1 - ratio * ratio;
	}
};