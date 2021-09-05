import { CachedParseTree } from '../../parsing/parse-tree-analysis/CachedParseTree.js';
import { fetchJson } from '../../fetchJson.js';
import { RateLimiter } from '../../RateLimiter.js';
import { ScriptExampleDisplay } from './ScriptExampleDisplay.js';
const examples = await fetchJson('json/scriptExamples.json');

// a map from example URL to ScriptExampleDisplay.
const examplesMap = new Map();
let allTreesAvailablePromise;

class PrivateScriptExampleDisplayRepository {
	allTreesAvailable() {
		return allTreesAvailablePromise;
	}

	get(url, runImmediately) {
		if (typeof url !== 'string')
			throw new Error('url must be a string.  Not: ' + url);
		if (!examplesMap.has(url)) {
			examplesMap.set(url, new ScriptExampleDisplay(url, runImmediately));
		}
		const result = examplesMap.get(url);
		if (runImmediately && result.div === undefined)
			result.startRunning();
		return result;
	}

	getParseTree(url) {
		let display = examplesMap.get(url);
		if (display === undefined)
			display = this.get(url, true);
		if (display.cachedParseTree === undefined && display.tree !== undefined)
			display.cachedParseTree = new CachedParseTree(display.tree, new Map(), new Map());
		return display.cachedParseTree;
	}

	resized() {
		for (const [key, value] of examplesMap) {
			// draw using timeout to help the UI stay responsive since the redraw can be slow.
			RateLimiter.run('ScriptExampleDisplayRepository-' + key, function() {
				value.resized();
			}, 100);
		}
	}
}

const ScriptExampleDisplayRepository = new PrivateScriptExampleDisplayRepository();

function getAllTreesAvailablePromise() {
	return new Promise(function(resolve, reject) {
		let remainingExamples = examples.map(exampleInfo => exampleInfo.filename);
		let interval;
		function update() {
			remainingExamples = remainingExamples.filter(filename =>
				ScriptExampleDisplayRepository.getParseTree(filename) === undefined
			);
			if (remainingExamples.length === 0 && interval !== undefined) {
				clearInterval(interval);
				interval = undefined;
			}
		}

		interval = setInterval(update, 500);
		update();
	});
}
allTreesAvailablePromise = getAllTreesAvailablePromise();

export { ScriptExampleDisplayRepository };