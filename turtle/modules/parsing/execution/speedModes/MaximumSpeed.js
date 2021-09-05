import { ExecutionSpeedMode } from './ExecutionSpeedMode.js';

export class MaximumSpeed extends ExecutionSpeedMode {
	static MaxInstructionsPerInterval = 1000000;
	static MinInstructionsPerInterval = 500;
	static idealMillis = 40;

	constructor() {
		super('Maximum Speed');
		this.timingQueue = [];
	}

	getInstructionsPerInterval() {
		if (this.timingQueue.length === 0)
			return MaximumSpeed.MinInstructionsPerInterval;

		// Estimate the number of instructions to run in the ideal number of milliseconds.
		// Do this by averaging estimates from the last few data points.
		var instructionsToGetIdealMillis = 0;
		this.timingQueue.forEach(function(timingInfo) {
			instructionsToGetIdealMillis += timingInfo.instructionCount * MaximumSpeed.idealMillis / timingInfo.timeMillis;
		});
		instructionsToGetIdealMillis /= this.timingQueue.length;
		return Math.max(MaximumSpeed.MinInstructionsPerInterval,
			Math.min(instructionsToGetIdealMillis, MaximumSpeed.MaxInstructionsPerInterval));
	}

	setLastIntervalTime(timeMillis) {
		this.timingQueue.push({
			'instructionCount': this.getInstructionsPerInterval(),
			'timeMillis': timeMillis
		});
		if (this.timingQueue.length > 5)
			this.timingQueue.shift();
	}

	stoppedTiming() {
		this.timingQueue = [];
	}
}