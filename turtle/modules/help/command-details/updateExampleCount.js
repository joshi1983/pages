import { getMatchedResults } from '../../file/file-load-example/getMatchedResults.js';
import { ScriptExampleDisplayRepository } from '../../file/file-load-example/ScriptExampleDisplayRepository.js';
 
// Avoid dependency cycle.
let latestQuery;
let showLoadExampleDialog = function(query) {
	latestQuery = query;
}; // a definition to use if showLoadExampleDialog is called before the actual module gets loaded.

import('../../file/file-load-example/showLoadExampleDialog.js').then(function(result) {
	showLoadExampleDialog = result.showLoadExampleDialog;
	if (latestQuery !== undefined)
		showLoadExampleDialog(latestQuery);
});

class ExampleCountProcessor {
	dispose() {
		this.primaryName = undefined;
		this.container = undefined;
		this.span = undefined;
		if (this.loadExamples !== undefined)
			this.loadExamples.removeEventListener('click', this.loadExamplesDialog);
		this.loadExamples = undefined;
		this.loadExamplesDialog = undefined;
		if (this.intervalTimer !== undefined) {
			clearInterval(this.intervalTimer);
			this.intervalTimer = undefined;
		}
	}

	setCommand(primaryName) {
		if (this.primaryName !== undefined)
			this.dispose();
		this.primaryName = primaryName;
		this.container = document.getElementById('example-usage-count');
		this.span = document.getElementById('command-example-usage-count');
		const spinner = document.getElementById('command-example-usage-count-spinner');
		this.plural = document.getElementById('command-example-usage-count-plural');
		this.loadExamples = document.getElementById('command-example-load-examples');
		const outer = this;
		this.loadExamplesDialog = function() {
			showLoadExampleDialog(`cmd:${outer.primaryName}`);
		};
		this.loadExamples.addEventListener('click', this.loadExamplesDialog);
		function lookUp() {
			const results = getMatchedResults(`cmd:${primaryName}`);
			outer.span.innerText = `${results.length}`;
			if (results.length === 1)
				outer.plural.classList.add('hidden');
			else
				outer.plural.classList.remove('hidden');
			if (results.length === 0)
				outer.container.classList.add('hidden');
			else
				outer.container.classList.remove('hidden');
		}
		spinner.classList.add('loading');
		lookUp();
		this.intervalTimer = setInterval(lookUp, 2000);
		ScriptExampleDisplayRepository.allTreesAvailable().then(function() {
			// if this hasn't been disposed yet.
			// This check is important if a user views command details for more than 
			// one command before all the WebLogo script examples load.
			if (primaryName !== outer.primaryName)
				return;

			clearInterval(outer.intervalTimer);
			outer.intervalTimer = undefined;
			lookUp();
			spinner.classList.remove('loading');
			setTimeout(function() {
				spinner.remove();
			}, 1000);
		});
	}
};

let processorSingleton = new ExampleCountProcessor();

export function updateExampleCount(primaryName) {
	if (typeof primaryName !== 'string')
		throw new Error('primaryName must be a string.  Not: ' + primaryName);
	processorSingleton.setCommand(primaryName);
};