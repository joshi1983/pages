import { EasingFunction } from './EasingFunction.js';

export class EaseInSine extends EasingFunction {
	constructor() {
		super();
	}

	getRatio(ratio) {
		return 1 - Math.cos( ratio * Math.PI / 2 );
	}
};