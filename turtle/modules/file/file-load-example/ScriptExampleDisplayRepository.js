import { AsyncParseTask } from '../../parsing/AsyncParseTask.js';
import { CachedParseTree } from '../../parsing/parse-tree-analysis/CachedParseTree.js';
import { clamp } from
'../../clamp.js';
import { ExampleDOMStatus } from
'../../components/loading-dialog/ExampleDOMStatus.js';
import { ExamplesParseStatus } from
'../../components/loading-dialog/ExamplesParseStatus.js';
import { ExampleRunStatus } from
'../../components/loading-dialog/ExampleRunStatus.js';
import { fetchJson } from '../../fetchJson.js';
import { ScriptExampleDisplay } from './ScriptExampleDisplay.js';
import { sleep } from '../../sleep.js';
const examples = await fetchJson('json/scriptExamples.json');

// We don't want all the examples loaded in prototypes.
if (document.location.href.indexOf('/prototypes/') !== -1) {
	examples.splice(0, examples.length);
}

// a map from example URL to ScriptExampleDisplay.
const examplesMap = new Map();
let allTreesAvailablePromise;

class PrivateScriptExampleDisplayRepository {
	allTreesAvailable() {
		return allTreesAvailablePromise;
	}

	decreasePriorityForAllExamples() {
		for (const display of examplesMap.values()) {
			display.decreasePriority();
		}
	}

	get(url, runImmediately) {
		if (typeof url !== 'string')
			throw new Error('url must be a string.  Not: ' + url);
		let result = examplesMap.get(url);
		if (result === undefined) {
			result = new ScriptExampleDisplay(url, runImmediately);
			examplesMap.set(url, result);
		}
		if (runImmediately && result.div === undefined)
			result.startRunning();
		return result;
	}

	getParseTree(url) {
		let display = examplesMap.get(url);
		if (display === undefined)
			display = this.get(url, false);
		if (display.cachedParseTree === undefined && display.tree !== undefined)
			display.cachedParseTree = new CachedParseTree(display.tree, new Map(), new Map());
		return display.cachedParseTree;
	}

	resized() {
		// start with high priority.
		for (const [key, value] of examplesMap) {
			if (value.asyncParseTask.priority === AsyncParseTask.HIGH_PRIORITY) {
				value.resized();
			}
		}
	}

	urlToCode(url) {
		const display = ScriptExampleDisplayRepository.get(url, false);
		if (display !== undefined)
			return display.code;
	}
}

const ScriptExampleDisplayRepository = new PrivateScriptExampleDisplayRepository();

async function startInitializingDOMForExamples() {
	let chunkSize = 10;
	const goalChunkTime = 300;
	let prevTime = Date.now();
	for (let i = 0; i < examples.length;) {
		// process several syncronously for a little extra speed.
		for (let chunkIndex = 0; i < examples.length &&
		chunkIndex < chunkSize; chunkIndex++) {
			const example = examples[i];
			const display = ScriptExampleDisplayRepository.get(example.filename);
			if (display !== undefined && display.div === undefined) {
				display._initializeDOM();
			}
			i++;
		}
		const elapsedTime = Date.now() - prevTime;
		if (elapsedTime > 1)
			chunkSize = clamp(Math.floor(chunkSize * goalChunkTime / elapsedTime), 1, 200);

		prevTime = Date.now();
		ExampleDOMStatus.setTitle(`Initialized DOM for ${i + 1} of ${examples.length} examples`);
		await sleep(2);
	}
	ExampleDOMStatus.completed();
	startRunningExamples();
}

async function startRunningExamples() {
	let chunkSize = 10;
	const goalChunkTime = 300;
	let prevTime = Date.now();
	for (let i = 0; i < examples.length;) {
		// process several syncronously for a little extra speed.
		for (let chunkIndex = 0; i < examples.length &&
		chunkIndex < chunkSize; chunkIndex++) {
			const example = examples[i];
			const display = ScriptExampleDisplayRepository.get(example.filename);
			if (display !== undefined) {
				const promise = display.startRunningIfNoParsingError();
				if (promise !== undefined)
					await promise;
			}
			i++;
		}
		const elapsedTime = Date.now() - prevTime;
		if (elapsedTime > 1)
			chunkSize = clamp(Math.floor(chunkSize * goalChunkTime / elapsedTime), 1, 10);

		prevTime = Date.now();
		ExampleRunStatus.setTitle(`Started ${i + 1} of ${examples.length} examples`);
		await sleep(2);
	}
	ExampleRunStatus.completed();
}

function getAllTreesAvailablePromise() {
	return new Promise(function(resolve, reject) {
		let remainingExamples = examples.map(exampleInfo => exampleInfo.filename);
		let interval;
		function update() {
			remainingExamples = remainingExamples.filter(filename =>
				ScriptExampleDisplayRepository.getParseTree(filename) === undefined
			);
			ExamplesParseStatus.setTitle(`Waiting to parse ${remainingExamples.length} examples`);
			if (remainingExamples.length === 0 && interval !== undefined) {
				clearInterval(interval);
				interval = undefined;
				ExamplesParseStatus.completed();
				startInitializingDOMForExamples();
				resolve(examplesMap);
			}
		}
		interval = setInterval(update, 1000);
	});
}
allTreesAvailablePromise = getAllTreesAvailablePromise();

export { ScriptExampleDisplayRepository };