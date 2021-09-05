import { Status } from
'./Status.js';

class ExampleDOMStatus_ extends Status {
	constructor() {
		super('Waiting to initialize document elements for example programs',
			'All examples have DOM initialized');
	}
};

export const ExampleDOMStatus = new ExampleDOMStatus_();