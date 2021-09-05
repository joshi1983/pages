import { EasingFunction } from './EasingFunction.js';

export class EaseLinear extends EasingFunction {
	constructor() {
		super();
	}

	getRatio(ratio) {
		return ratio;
	}
};