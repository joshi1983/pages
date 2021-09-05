import { EasingFunction } from './EasingFunction.js';

export class EaseOutSine extends EasingFunction {
	constructor() {
		super();
	}

	getRatio(ratio) {
		return Math.sin( ratio * Math.PI / 2 );
	}
};