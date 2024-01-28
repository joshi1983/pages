import { fetchText } from './fetchText.js';
const queue = [];
const MAX_CONCURRENT_FETCHES = 3;
let concurrentCount = 0;

function getNextFetcher() {
	let resultIndex = 0;
	for (let i = 0; i < queue.length; i++) {
		const f = queue[i];
		if (f.priority > queue[resultIndex].priority) {
			resultIndex = i;
			if (f.priority === PriorityTextFetcher.HIGH_PRIORITY)
				break;
				/* We can't find anything with higher priority so we can confidently stop the search.
				*/
		}
	}
	const result = queue[resultIndex];
	queue.splice(resultIndex, 1); // remove the element.
	return result;
}

function process() {
	if (concurrentCount < MAX_CONCURRENT_FETCHES && queue.length !== 0) {
		concurrentCount++;
		const nextFetcher = getNextFetcher();
		function done() {
			concurrentCount--;
			nextFetcher.dispose();
			process();
		}
		fetchText(nextFetcher.url).then(function(text) {
			nextFetcher._resolve(text);
			done();
		}).catch(function() {
			nextFetcher._reject(...arguments);
			done();
		});
	}
}

export class PriorityTextFetcher {
	static LOW_PRIORITY = 1;
	static HIGH_PRIORITY = 2;

	constructor(url, priority) {
		this.url = url;
		this.priority = priority;
		const outer = this;
		this.promise = new Promise(function(resolve, reject) {
			outer._resolve = resolve;
			outer._reject = reject;
		});
		queue.push(this);
		process();
	}

	dispose() {
		this.url = undefined;
		this.priority = undefined;
		this.promise = undefined;
		this._resolve = undefined;
		this._reject = undefined;
	}
};