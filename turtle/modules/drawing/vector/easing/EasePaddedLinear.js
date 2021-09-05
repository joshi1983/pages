import { EasingFunction } from './EasingFunction.js';

export class EasePaddedLinear extends EasingFunction {
	constructor(padding) {
		super();
		this.padding = padding;
		this.linearRange = 1 - padding * 2;
	}

	getRatio(ratio) {
		if (ratio <= this.padding)
			return 0;
		if (ratio >= 1 - this.padding)
			return 1;
		return ratio / this.linearRange;
	}
};