import { convertMessageObjectsToParseMessages } from
'../serialization/convertMessageObjectsToParseMessages.js';
import { convertObjectToParseTree } from
'../serialization/convertObjectToParseTree.js';

let worker, currentTask;
const compileTasks = [];

function getOrCreateWorker() {
	if (worker === undefined)
		worker = new Worker("./compileExampleWorker.js", { 'type': "module" });
	return worker;
}

function convertObjectToProgram(programObject) {
	// FIXME: convert to an instance of LogoProgram.
	return programObject;
}

function startProcessing() {
	if (currentTask !== undefined)
		return; // can not process more than one task at a time.
	if (compileTasks.length === 0) {
		return; // nothing to process.
	}
	try {
		const myWorker = getOrCreateWorker();
		const nextIndex = 0;
		currentTask = compileTasks[nextIndex];
		compileTasks.splice(nextIndex, 1); // remove task.
		myWorker.onmessage = function(e) {
			const program = e.data.program === undefined ? undefined :
				convertObjectToProgram(e.data.program);
			const tree = convertObjectToParseTree(e.data.tree);
			const result = {
				'program': program,
				'messages': convertMessageObjectsToParseMessages(e.data.messages, tree)
			};
			currentTask.resolve(result);
			taskCompleted();
		};
		myWorker.onerror = function(e) {
			currentTask.reject(e);
			taskCompleted();
		};
		myWorker.postMessage(currentTask.code);
	}
	catch (e1) {
		console.error('AsyncCompileTask error thrown. e1=', e1);
		throw e1;
	} 
}

class AsyncCompileTask {
	constructor(code, resolve, reject) {
		this.code = code;
		this.resolve = resolve;
		this.reject = reject;
	}
};

function taskCompleted() {
	currentTask = undefined;
	startProcessing(); // try to continue processing.
}

export function asyncCompile(code) {
	if (typeof code !== 'string')
		throw new Error(`code must be a string but code=${code}`);

	return new Promise(function(resolve, reject) {
		const newTask = new AsyncCompileTask(code, resolve, reject);
		compileTasks.push(newTask);
		startProcessing();
	});
};