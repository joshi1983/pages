import { Status } from
'./Status.js';

class ExampleRunStatus_ extends Status {
	constructor() {
		super('Waiting for examples to start executing',
			'All examples started executing');
	}
};

export const ExampleRunStatus = new ExampleRunStatus_();