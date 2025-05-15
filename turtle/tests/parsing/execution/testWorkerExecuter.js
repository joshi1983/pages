import { WorkerExecuter } from
'../../../modules/parsing/execution/WorkerExecuter.js';

export function testWorkerExecuter(logger) {
	const executer = new WorkerExecuter(`
import('/turtle/modules/noop.js');

	console.log('console log from WorkerExecuter test code');

addEventListener('message', function(input) {
	self.postMessage('Hello world');
});`);
};