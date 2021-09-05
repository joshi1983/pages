import { Status } from
'./Status.js';

class ExamplesParseStatus_ extends Status {
	constructor() {
		super('Waiting to parse examples', 'Parsed examples');
	}
}

export const ExamplesParseStatus = new ExamplesParseStatus_();
