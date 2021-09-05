import { NativePRGenerator } from './helpers/random/NativePRGenerator.js';
import { Xoshiro128PRGenerator } from './helpers/random/Xoshiro128PRGenerator.js';

export class RandomCommands {
	constructor(settings) {
		this.settings = settings;
		this.resetPseudorandomGenerator();
	}

	pick(list1) {
		const index = Math.floor(this.prGenerator.randomRatio() * list1.length);
		return list1[index];
	}

	rerandom() {
		let seed = 0;
		if (arguments.length === 1)
			seed = arguments[0];
		this.prGenerator = new Xoshiro128PRGenerator(seed);
	}

	random(max) {
		if (max < 0) {
			this._warn('random command expects a number greater than 0 but received ' + max);
			max = 0;
		}
		return Math.floor(this.prGenerator.randomRatio() * max);
	}

	randomColor() {
		return [
			Math.floor(256 * this.prGenerator.randomRatio()),
			Math.floor(256 * this.prGenerator.randomRatio()),
			Math.floor(256 * this.prGenerator.randomRatio())
		];
	}

	randomRatio() {
		return this.prGenerator.randomRatio();
	}

	resetPseudorandomGenerator() {
		const seed = this.settings.seedNumber;
		if (Number.isInteger(seed)) {
			this.rerandom(seed);
		}
		else
			this.prGenerator = new NativePRGenerator();
	}
};