import { EasingFunction } from './EasingFunction.js';

const n1 = 7.5625, d1 = 2.75;

export class EaseBounceOut extends EasingFunction {
	constructor() {
		super();
	}

	getRatio(ratio) {
		if ( ratio < 1 / d1 ) {
			return n1 * ratio * ratio;
		} else if ( ratio < 2 / d1 ) {
			return n1 * (ratio -= (1.5 / d1)) * ratio + 0.75;
		} else if ( ratio < 2.5 / d1 ) {
			return n1 * (ratio -= (2.25 / d1)) * ratio + 0.9375;
		} else {
			return n1 * ( ratio -= (2.625 / d1 )) * ratio + 0.984375;
		}
	}
};