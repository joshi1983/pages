import { EasingFunction } from './EasingFunction.js';

export class EaseOutQuart extends EasingFunction {
	constructor() {
		super();
	}

	getRatio(ratio) {
		ratio = 1 - ratio;
		return 1 - Math.pow(ratio, 4);
	}
};