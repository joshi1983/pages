export class WorkerExecuter {
	constructor(jsCode) {
		if (typeof jsCode !== 'string')
			throw new Error(`jsCode must be a string but found ${jsCode}`);

		// The following is adapted from an answer at:
		// https://stackoverflow.com/questions/10343913/how-to-create-a-web-worker-from-a-string
		let blob = new Blob([jsCode], {type: 'application/javascript'});
		let dataUri = 'data:application/javascript;base64,' + btoa(jsCode);
		console.log(dataUri);
		//dataUri = URL.createObjectURL(blob);
		//dataUri = './importExample.js';
		dataUri = './dynamicImportWorker.js';
		let worker = new Worker(dataUri, { "name": "WorkerExecuter",
			'type': "module",
			"credentials": "same-origin"
		});

		// Test, used in all examples:
		worker.onmessage = function(e) {
			console.log('Response: ' + e.data);
		};
		this.worker = worker;
		worker.postMessage(['./modules/noop.js',
			'./modules/Settings.js']);
	}

	dispose() {
		this.worker.terminate();
		this.worker = undefined;
	}
};