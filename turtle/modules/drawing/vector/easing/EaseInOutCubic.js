import { EasingFunction } from './EasingFunction.js';

export class EaseInOutCubic extends EasingFunction {
	constructor() {
		super();
	}

	getRatio(ratio) {
		if (ratio < 0.5)
			return 4 * ratio * ratio * ratio;
		else
			return 1 - Math.pow( -2 * ratio + 2, 3 ) / 2;
	}
};