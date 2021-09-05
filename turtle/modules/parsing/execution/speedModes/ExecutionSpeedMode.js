export class ExecutionSpeedMode {
	constructor(name, instructionsPerInterval) {
		if (typeof name !== 'string')
			throw new Error('name must be a string');
		if (instructionsPerInterval !== undefined && typeof instructionsPerInterval !== 'number')
			throw new Error('instructionsPerInterval must either be undefined or a number');

		this.name = name;
		this.instructionsPerInterval = instructionsPerInterval;
	}

	getInstructionsPerInterval() {
		return this.instructionsPerInterval;
	}

	setLastIntervalTime(timeMillis) {
	}

	stoppedTiming() {
	}
};