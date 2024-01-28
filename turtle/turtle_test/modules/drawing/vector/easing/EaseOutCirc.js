import { EasingFunction } from './EasingFunction.js';

export class EaseOutCirc extends EasingFunction {
	constructor() {
		super();
	}

	getRatio(ratio) {
		ratio = 1 - ratio;
		return Math.sqrt( 1 - ratio * ratio);
	}
};