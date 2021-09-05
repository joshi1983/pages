import { Status } from
'./Status.js';

class ZippedExamplesStatus_ extends Status {
	constructor() {
		super('Downloading examples', 'Downloaded examples');
		const outer = this;

		import('../../file/file-load-example/ZippedExamples.js').then(function(m) {
			const ZippedExamples = m.ZippedExamples;
			ZippedExamples.asyncInit().then(function() {
				outer.completed();
			});
		});
	}
};

export const ZippedExamplesStatus = new ZippedExamplesStatus_();