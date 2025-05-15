	import { noop } from '/turtle/modules/noop.js';

console.log('console log from WorkerExecuter test code');

addEventListener('message', function(input) {
	
	
	self.postMessage('Hello world');
});