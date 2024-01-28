import { ExecutionSpeedMode } from './ExecutionSpeedMode.js';

export class SuperDuperSlow extends ExecutionSpeedMode {
	constructor() {
		super('Super Duper Slow', 0.2);
		this.counter = 0;
	}

	getInstructionsPerInterval() {
		this.counter++;
		if (this.counter % 30 === 0)
			return 1;
		else
			return 0;
	}
}