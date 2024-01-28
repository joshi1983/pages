import { ExecutionSpeedMode } from './ExecutionSpeedMode.js';

export class VerySlow extends ExecutionSpeedMode {
	constructor() {
		super('Very Slow', 0.2);
		this.counter = 0;
	}

	getInstructionsPerInterval() {
		this.counter++;
		if (this.counter % 5 === 0)
			return 1;
		else
			return 0;
	}
}