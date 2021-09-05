import { Status } from
'./Status.js';

class ExecutionSpeedMenuItemStatus_ extends Status {
	constructor() {
		super('Loading execution speed menu item', 'Loaded execution speed menu item');
	}
}

export const ExecutionSpeedMenuItemStatus = new ExecutionSpeedMenuItemStatus_();