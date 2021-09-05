import { EasingFunction } from './EasingFunction.js';

export class EaseInCirc extends EasingFunction {
	constructor() {
		super();
	}

	getRatio(ratio) {
		return 1 - Math.sqrt( 1 - ratio * ratio );
	}
};