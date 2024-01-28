import { convertMessageObjectsToParseMessages } from './serialization/convertMessageObjectsToParseMessages.js';
import { convertObjectToParseTree } from './serialization/convertObjectToParseTree.js';
import { DeepEquality } from '../DeepEquality.js';
import { isNumber } from '../isNumber.js';

function proceduresMapEquals(procs1, procs2) {
	const keys1 = Array.from(procs1.keys());
	const keys2 = Array.from(procs2.keys());
	return DeepEquality.arraysEqual(keys1, keys2);
}

let worker;

function getOrCreateWorker() {
	if (worker === undefined)
		worker = new Worker("./parseWorker.js", { type: "module" });
	return worker;
}

// a queue for parsing tasks
let parseTasks = [], currentTask;

function getIndexOfMaximumPriority() {
	let result = 0;
	for (let i = 0; i < parseTasks.length; i++) {
		if (parseTasks[i].priority > parseTasks[result].priority)
			result = i;
	}
	return result;
}

/*
Checks for a problem that was reproduced in Mozilla Firefox 106.0.3 and 106.0.4.
The problem is reported as a bug in the browser at:
https://bugzilla.mozilla.org/show_bug.cgi?id=1589935

The problem comes down to Firefox not supporting the { type: "module" } used in getOrCreateWorker().  Edge and Chrome do support it.
*/
function isWebworkerModuleError(problemDetails) {
	return typeof problemDetails === 'object' &&
		typeof problemDetails.message === 'string' &&
		problemDetails.message.indexOf('import declarations may only appear at top level of a module') !== -1;
}

/*
The purpose of asyncInit is mainly to 
testing if the browser is capable of parsing in a web worker.
Some browsers can't because the module import statements fail which are needed by how parsing is implemented in WebLogo.
*/
function asyncInit() {
	return new Promise(function(resolve, reject) {
		function _resolve() {
			resolve({
				'isFailing': false,
				'webWorkerModuleImportError': false
			});
		}
		function _reject(problemDetails) {
			let webWorkerModuleImportError = false;
			if (isWebworkerModuleError(problemDetails)) {
				webWorkerModuleImportError = true;
			}
			resolve({
				'isFailing': true,
				'webWorkerModuleImportError': webWorkerModuleImportError
			});
		}
		const code = '';
		const proceduresMap = new Map();
		new AsyncParseTask(code, proceduresMap, _resolve, _reject, AsyncParseTask.LOW_PRIORITY, true);
	});
}

export class AsyncParseTask {
	static LOW_PRIORITY = 1;
	// for tasks like parsing the WebLogo code examples

	static HIGH_PRIORITY = 2;
	// for most other parsing tasks where a lack of urgency will
	// quickly impact responsiveness of the user interface
	// For example, parsing to compile for Set -> Animation Time
	// or while downloading an animation.

	static asyncInit() {
		return initPromise;
	}

	constructor(code, proceduresMap, resolve, reject, priority, isHidingErrors) {
		if (!isNumber(priority))
			throw new Error(`priority must be a number.  Not: ${priority}`);
		if (isHidingErrors === undefined)
			isHidingErrors = false;
		this.code = code;
		this.proceduresMap = proceduresMap;
		this.priority = priority;
		this._resolve = resolve;
		this._reject = reject;
		this.isHidingErrors = isHidingErrors;
		this.isDone = false;
		parseTasks.push(this);
		AsyncParseTask.startProcessing();
	}

	cancel() {
		this.reject('cancel');
		if (currentTask === this) {
			worker.terminate();
			worker = undefined;
			AsyncParseTask.taskCompleted();
		}
		else
			parseTasks = parseTasks.filter(t => t !== this);
	}

	inputsEqual(otherTask) {
		if (otherTask instanceof AsyncParseTask)
			return this.code === otherTask.code && proceduresMapEquals(this.proceduresMap, otherTask.proceduresMap);
		else if (arguments.length === 2) {
			if (typeof arguments[0] === 'string' && arguments[1] instanceof Map)
				return this.code === arguments[0] && proceduresMapEquals(this.proceduresMap, arguments[1]);
			else
				throw new Error(`[0] should be code but is ${arguments[0]}. [1] should be a procedures Map but is ${arguments[1]}`);
		}
		else
			throw new Error('Invalid arguments.  Either an AsyncParseTask or the code and its procedures Map are expected.');
	}

	reject(problemDetails) {
		if (this.isDone === false) {
			if (problemDetails !== 'cancel')
				console.error('AsyncParseTask.js reject called and not Done yet.  problemDetails=', problemDetails);
			this._reject(problemDetails);
			this.isDone = true;
		}
	}

	resolve(result) {
		if (this.isDone === false) {
			this._resolve(result);
			this.isDone = true;
		}
	}

	static startProcessing() {
		if (currentTask !== undefined)
			return; // can not process more than one task at a time.
		if (parseTasks.length === 0) {
			return; // nothing to process.
		}
		try {
			const myWorker = getOrCreateWorker();
			const nextIndex = getIndexOfMaximumPriority();
			currentTask = parseTasks[nextIndex];
			parseTasks.splice(nextIndex, 1); // remove task.
			myWorker.onmessage = function(e) {
				const tree = e.data.tree === undefined ? undefined : convertObjectToParseTree(e.data.tree);
				const result = {
					'tree': tree,
					'messages': convertMessageObjectsToParseMessages(e.data.messages, tree)
				};
				currentTask.resolve(result);
				parseTasks = parseTasks.filter(function(task_) {
					if (task_.inputsEqual(currentTask)) {
						task_.resolve(result);
						return false; // indicate remove.
					}
					return true; // indicate task is not resolved.
				});
				AsyncParseTask.taskCompleted();
			};
			myWorker.onerror = function(e) {
				if (currentTask.isHidingErrors === false)
					console.error('error happened in web worker. e=' + e);
				currentTask.reject(e);
				AsyncParseTask.taskCompleted();
			};
			myWorker.postMessage([currentTask.code, currentTask.proceduresMap]);
		}
		catch (e1) {
			console.error('AsyncParseTask error thrown. e1=', e1);
			throw e1;
		} 
	}

	static taskCompleted() {
		currentTask = undefined;
		AsyncParseTask.startProcessing(); // try to continue processing.
	}
};

const initPromise = asyncInit();