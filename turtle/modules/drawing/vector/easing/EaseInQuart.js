import { EasingFunction } from './EasingFunction.js';

export class EaseInQuart extends EasingFunction {
	constructor() {
		super();
	}

	getRatio(ratio) {
		return Math.pow(ratio, 4);
	}
};