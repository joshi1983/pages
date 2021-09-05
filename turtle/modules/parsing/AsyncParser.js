import { AsyncParseTask } from './AsyncParseTask.js';
import { isNumber } from '../isNumber.js';
import { LogoParser } from './LogoParser.js';
await LogoParser.asyncInit();
const asyncParseTaskStatus = await AsyncParseTask.asyncInit();

export function asyncParser(text, parseLogger, proceduresMap, priority) {
	return new Promise(function(resolve, reject) {
		new AsyncParseTask(text, proceduresMap, resolve, reject, priority);
	});
};

function parseSync(text, parseLogger, proceduresMap) {
	return LogoParser.getParseTree(text, parseLogger, proceduresMap);
}

export class AsyncParser {
	/*
	@param queueTasks should be either true or false.
	true to have multiple concurrent parsing tasks queue up.
	false to have only the latest parse performed.  Any older parse calls still being processed will be cancelled. 

	Cancelling any older parsing is useful for the Code Editor as the user types code changes.  
	The older parse would have been with code that we don't care about anymore.
	*/
	constructor(queueTasks) {
		if (queueTasks === undefined)
			queueTasks = false;
		else if (typeof queueTasks !== 'boolean')
			throw new Error(`queueTasks must either be undefined or boolean but got ${queueTasks}`);
		this.queueTasks = queueTasks;
		this.currentTask = undefined;
	}

	parse(text, priority, parseLogger, proceduresMap, setAsyncParseTask) {
		if (typeof text !== 'string')
			throw new Error(`text must be a string. Not: ${text}`);
		if (typeof parseLogger !== 'object')
			throw new Error(`parseLogger must be an object.  Not: ${parseLogger}`);
		if (!(proceduresMap instanceof Map))
			throw new Error(`proceduresMap must be a Map but got ${proceduresMap}`);
		if (!isNumber(priority))
			throw new Error(`priority must be a number but got ${priority}`);
		if (setAsyncParseTask !== undefined && typeof setAsyncParseTask !== 'function')
			throw new Error(`setAsyncParseTask must either be undefined or a function but got ${setAsyncParseTask}`);
		if (this.currentTask !== undefined) {
			if (this.queueTasks === false && !this.currentTask.inputsEqual(text, proceduresMap)) {
				this.currentTask.cancel();
				this.currentTask = undefined;
			}
		}
		const outer = this;
		return new Promise(function(_resolve, _reject) {
			function resolve(result) {
				try {
					outer.currentTask = undefined;
					parseLogger.logAll(result.messages);
					_resolve(result.tree);
				}
				catch (e) {
					console.error('exception thrown in resolve.  e=', e);
					throw e;
				}
			}
			function reject(problemDetails) {
				if (problemDetails !== 'cancel')
					console.error('reject called. problemDetails=' + problemDetails);
				outer.currentTask = undefined;
				_reject(problemDetails);
			}
			if (asyncParseTaskStatus.isFailing)
				_resolve(parseSync(text, parseLogger, proceduresMap));
			else {
				outer.currentTask = new AsyncParseTask(text, proceduresMap, resolve, reject, priority);
				if (setAsyncParseTask !== undefined) {
					setAsyncParseTask(outer.currentTask);
				}
			}
		});
	}
};