import { ExecutionSpeedMode } from './ExecutionSpeedMode.js';

export class FastSpeed extends ExecutionSpeedMode {
	constructor() {
		super('Fast', 100);
	}
}