import { InnerHTMLSetter } from './html-setters/InnerHTMLSetter.js';
import { runTests } from './html-setter-tests/runTests.js';
import { SelectiveHTMLSetter } from '../modules/components/syntax-highlighter/SelectiveHTMLSetter.js';
import { setHTMLBenchmark } from './setHTMLBenchmark.js';

function benchmarkResultsToDiv(results, div) {
	div.innerHTML = '';
	for (let key in results) {
		const pairDiv = document.createElement('div');
		const label = document.createElement('label');
		label.innerText = key;
		const val = document.createElement('span');
		val.innerText = results[key];
		pairDiv.appendChild(label);
		pairDiv.appendChild(val);
		div.appendChild(pairDiv);
	}
}

function init() {
	const setters = [InnerHTMLSetter, SelectiveHTMLSetter];
	runTests(setters);
	setters.forEach(function(Setter) {
		const div = document.getElementById(Setter.name);
		const testDiv = document.createElement('div');
		const setter = new Setter(testDiv);
		benchmarkResultsToDiv(setHTMLBenchmark(setter), div);
	});
}

if (document.readyState === 'loading')
	document.addEventListener('DOMContentLoaded', init);
else
	init();