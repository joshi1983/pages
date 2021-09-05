import { EasingFunction } from './EasingFunction.js';

export class EaseInOutQuad extends EasingFunction {
	constructor() {
		super();
	}

	getRatio(ratio) {
		if (ratio < 0.5)
			return 2 * ratio * ratio;
		else
			return 1 - Math.pow( -2 * ratio + 2, 2 ) / 2;
	}
};