import { ExecutionSpeedMode } from './ExecutionSpeedMode.js';

export class Slow extends ExecutionSpeedMode {
	constructor() {
		super('Slow', 1);
	}
}